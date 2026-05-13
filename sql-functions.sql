-- ══════════════════════════════════════════════════════════════
-- Antika Gallery — SQL Functions (Fixed)
-- التغييرات:
--   ① role بيتحفظ في raw_app_meta_data بدل raw_user_meta_data
--   ② إضافة increment_coupon_usage function
-- ══════════════════════════════════════════════════════════════

-- ── دالة تعيين رول للمستخدم عن طريق الإيميل ────────────────────
-- FIX: raw_app_meta_data بدل raw_user_meta_data
--      app_metadata = server-only، مش قابل للتعديل من الـ client
create or replace function set_user_role(user_email text, new_role text)
returns void as $$
declare
  target_id uuid;
begin
  select id into target_id from auth.users where email = user_email;
  if target_id is null then
    raise exception 'User not found: %', user_email;
  end if;
  -- FIX: app_metadata بدل user_metadata
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', new_role)
  where id = target_id;
end;
$$ language plpgsql security definer;

-- ── دالة تعيين رول عن طريق الـ ID ───────────────────────────────
-- FIX: raw_app_meta_data بدل raw_user_meta_data
create or replace function set_user_role_by_id(user_id uuid, new_role text)
returns void as $$
begin
  -- FIX: app_metadata بدل user_metadata
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', new_role)
  where id = user_id;

  if not found then
    raise exception 'User not found: %', user_id;
  end if;
end;
$$ language plpgsql security definer;

-- ── دالة جلب كل المشرفين ─────────────────────────────────────────
-- FIX: بيقرأ من raw_app_meta_data
create or replace function get_moderators()
returns table(id uuid, email text, full_name text, created_at timestamptz) as $$
begin
  return query
  select
    u.id,
    u.email,
    -- full_name لسه في user_metadata (مش حساسة)
    (u.raw_user_meta_data->>'full_name')::text as full_name,
    u.created_at
  from auth.users u
  -- FIX: قرأ الـ role من app_metadata
  where u.raw_app_meta_data->>'role' = 'moderator';
end;
$$ language plpgsql security definer;

-- ── FIX: دالة جديدة — increment_coupon_usage ────────────────────
-- كانت بتتنادى من config.js لكن ما كانتش موجودة!
-- بدونها كل الكوبونات بتشتغل لعدد غير محدود
create or replace function increment_coupon_usage(coupon_id uuid)
returns void as $$
begin
  update coupons
  set used_count = coalesce(used_count, 0) + 1
  where id = coupon_id;

  if not found then
    raise exception 'Coupon not found: %', coupon_id;
  end if;
end;
$$ language plpgsql security definer;

-- ── صلاحيات تشغيل الـ functions ──────────────────────────────────
grant execute on function set_user_role           to authenticated;
grant execute on function set_user_role_by_id     to authenticated;
grant execute on function get_moderators          to authenticated;
grant execute on function increment_coupon_usage  to authenticated;

-- ══════════════════════════════════════════════════════════════
-- بعد تشغيل هذا الملف، نفّذ السطر ده عشان تحدث الـ admin role:
--   SELECT set_user_role('moaz2009amen@gmail.com', 'admin');
-- ثم اعمل logout وLogin من لوحة التحكم
-- ══════════════════════════════════════════════════════════════
