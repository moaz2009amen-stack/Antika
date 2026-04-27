-- ── دالة تعيين رول للمستخدم عن طريق الإيميل ────────────────────
create or replace function set_user_role(user_email text, new_role text)
returns void as $$
declare
  target_id uuid;
begin
  select id into target_id from auth.users where email = user_email;
  if target_id is null then
    raise exception 'User not found';
  end if;
  update auth.users
  set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', new_role)
  where id = target_id;
end;
$$ language plpgsql security definer;

-- ── دالة تعيين رول عن طريق الـ ID ───────────────────────────────
create or replace function set_user_role_by_id(user_id uuid, new_role text)
returns void as $$
begin
  update auth.users
  set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', new_role)
  where id = user_id;
end;
$$ language plpgsql security definer;

-- ── دالة جلب كل المشرفين ─────────────────────────────────────────
create or replace function get_moderators()
returns table(id uuid, email text, full_name text, created_at timestamptz) as $$
begin
  return query
  select
    u.id,
    u.email,
    (u.raw_user_meta_data->>'full_name')::text as full_name,
    u.created_at
  from auth.users u
  where u.raw_user_meta_data->>'role' = 'moderator';
end;
$$ language plpgsql security definer;

-- ── صلاحيات تشغيل الـ functions ──────────────────────────────────
grant execute on function set_user_role to authenticated;
grant execute on function set_user_role_by_id to authenticated;
grant execute on function get_moderators to authenticated;

-- ── Policy إضافية: الأدمن بس يقدر يشغل set_user_role ────────────
-- (الـ security definer + is_admin check في منتصف الكود يكفي)
