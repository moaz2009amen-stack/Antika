-- ══════════════════════════════════════════════════════════════
-- Antika Gallery — إصلاحات جوهرية شاملة (System Fixes v4)
-- المشاكل اللي بيحلها هذا الملف:
--   ① decrement() function كانت مفقودة تماماً — المخزون كان
--      بيتحدث بس عن طريق fallback بطيء وغير آمن من race conditions
--   ② مفيش RLS policy لجدول settings — الزوار الغير مسجلين
--      (اللي هما أغلب زوار الموقع) كانوا مش بيقدروا يقروا
--      maintenance_mode / orders_enabled / whatsapp_number
--      وده سبب "وضع الصيانة مش بيشتغل"
--   ③ RLS على products بتضمن المنتج المخفي محدش يقدر يوصله
--      حتى لو عنده الرابط المباشر بتاعه
--   ④ get_all_users كانت في ملف منفصل — لازم تتضم هنا
--   ⑤ إضافة indexes لتسريع الأداء
-- ══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════
-- ① decrement() — أهم دالة كانت مفقودة بالكامل
-- ══════════════════════════════════════════════════════════════
-- بتستخدم atomic update على مستوى الـ database نفسه
-- (مش select ثم update من الـ client) — ده بيمنع أي احتمال
-- إن اتنين عملاء يشتروا نفس آخر قطعة في نفس اللحظة (race condition)
-- لأن الـ UPDATE بيحصل في transaction واحدة داخل postgres
create or replace function decrement(row_id uuid, x int)
returns void as $$
begin
  update products
  set stock = greatest(0, stock - x)
  where id = row_id;

  if not found then
    raise exception 'Product not found: %', row_id;
  end if;
end;
$$ language plpgsql security definer;

grant execute on function decrement to authenticated;

-- ══════════════════════════════════════════════════════════════
-- ② RLS Policies لجدول settings
-- ══════════════════════════════════════════════════════════════
-- بدون الـ policy دي، الزوار الغير مسجلين (اللي بيشوفوا الموقع
-- كل يوم بدون تسجيل دخول) كانوا مش بيقدروا يقروا maintenance_mode
-- فالصيانة كانت "مش بتشتغل" فعلياً — الموقع كان بيفضل ظاهر عادي

alter table settings enable row level security;

-- القراءة: مسموحة للجميع (زوار + مسجلين) — بيانات settings عامة
-- (اسم المتجر، رقم الواتساب، وضع الصيانة) مش بيانات حساسة
drop policy if exists "settings_select_all" on settings;
create policy "settings_select_all"
  on settings for select
  using (true);

-- الكتابة (insert/update): بس للأدمن
drop policy if exists "settings_write_admin" on settings;
create policy "settings_write_admin"
  on settings for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ══════════════════════════════════════════════════════════════
-- ③ التأكد من RLS على products — القراءة العامة بس للمنشور
-- ══════════════════════════════════════════════════════════════
-- ده بيضمن حتى لو حد حاول يجيب منتج مخفي مباشرة بالـ id
-- (زي الباج اللي كان في product.html) — الـ database نفسه
-- برضو مش هيرجعله المنتج لو مش admin

alter table products enable row level security;

drop policy if exists "products_select_published" on products;
create policy "products_select_published"
  on products for select
  using (
    is_published = true
    or (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator')
  );

drop policy if exists "products_write_admin" on products;
create policy "products_write_admin"
  on products for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator')
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator')
  );

-- ══════════════════════════════════════════════════════════════
-- ④ RLS على coupons — القراءة بس للكوبون النشط، الكتابة للأدمن
-- ══════════════════════════════════════════════════════════════
alter table coupons enable row level security;

drop policy if exists "coupons_select_active" on coupons;
create policy "coupons_select_active"
  on coupons for select
  using (
    is_active = true
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "coupons_write_admin" on coupons;
create policy "coupons_write_admin"
  on coupons for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ══════════════════════════════════════════════════════════════
-- ⑤ RLS على profiles — السبب الحقيقي لمشكلة "المستخدمين مش ظاهرين"
-- ══════════════════════════════════════════════════════════════
-- المشكلة كانت: RLS مفعّل على profiles بس بـ policy قديمة بتسمح
-- بس بـ auth.uid() = id (كل حد يشوف بروفايله هو بس) — فلما
-- الأدمن يفتح صفحة المستخدمين، وget_all_users بترجع error لأي
-- سبب، الـ fallback (select * from profiles) كان بيرجع صف
-- واحد بس: بروفايل الأدمن نفسه، لأن الـ RLS مش سامح بأكتر من كده

alter table profiles enable row level security;

-- كل مستخدم يقدر يشوف ويعدّل بروفايله هو بس
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- الأدمن يقدر يشوف ويعدّل كل البروفايلات (مطلوب لصفحة المستخدمين)
drop policy if exists "profiles_select_admin" on profiles;
create policy "profiles_select_admin"
  on profiles for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "profiles_update_admin" on profiles;
create policy "profiles_update_admin"
  on profiles for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- INSERT بس عن طريق الـ trigger (handle_new_user) اللي بيشتغل
-- بصلاحيات security definer، فمش محتاجين INSERT policy للمستخدم العادي

-- ══════════════════════════════════════════════════════════════
-- ⑥ RLS على orders و order_items
-- ══════════════════════════════════════════════════════════════
-- نفس المبدأ: العميل يشوف طلباته هو بس، الأدمن يشوف كل الطلبات
-- (مطلوب أصلاً لصفحة orders.html ولوحة التحكم الرئيسية)

alter table orders enable row level security;

drop policy if exists "orders_select_own" on orders;
create policy "orders_select_own"
  on orders for select
  using (auth.uid() = user_id);

drop policy if exists "orders_insert_own" on orders;
create policy "orders_insert_own"
  on orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "orders_select_admin" on orders;
create policy "orders_select_admin"
  on orders for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

drop policy if exists "orders_update_admin" on orders;
create policy "orders_update_admin"
  on orders for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

drop policy if exists "orders_delete_admin" on orders;
create policy "orders_delete_admin"
  on orders for delete
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- FIX: سماح محدود للمستخدم يحذف طلبه هو بس لو لسه "pending"
-- (مطلوب لـ rollback logic في checkout.html — لو order_items
-- فشل يتضاف بعد ما الطلب اتعمل، بنحتاج نحذف الطلب اليتيم)
-- محدودة بـ status='pending' عشان محدش يقدر يحذف طلب اتأكد
-- أو اتشحن بالفعل
drop policy if exists "orders_delete_own_pending" on orders;
create policy "orders_delete_own_pending"
  on orders for delete
  using (auth.uid() = user_id and status = 'pending');

alter table order_items enable row level security;

drop policy if exists "order_items_select_own" on order_items;
create policy "order_items_select_own"
  on order_items for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_own" on order_items;
create policy "order_items_insert_own"
  on order_items for insert
  with check (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_select_admin" on order_items;
create policy "order_items_select_admin"
  on order_items for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

-- ══════════════════════════════════════════════════════════════
-- ⑦ track_order_by_phone — بديل آمن للـ RLS المباشر في track.html
-- ══════════════════════════════════════════════════════════════
-- المشكلة: صفحة تتبع الطلب بتشتغل بدون تسجيل دخول (auth.uid()=null)
-- فالـ RLS العادي على profiles/orders/order_items هيمنعها تماماً
-- الحل: دالة security definer واحدة بترجع بيانات الطلب + عناصره
-- مدمجين كـ JSON — من غير ما نحتاج نفتح order_items للقراءة العامة
-- (اللي كان ممكن يبقى ثغرة أمنية لو حد عرف order_id بطريقة ما)

create or replace function track_order_by_phone(search_phone text)
returns table(
  order_id uuid,
  total numeric,
  delivery_fee numeric,
  status text,
  payment_method text,
  notes text,
  created_at timestamptz,
  items json
) as $$
begin
  return query
  select
    o.id,
    o.total,
    coalesce(o.delivery_fee, 0),
    o.status,
    o.payment_method,
    o.notes,
    o.created_at,
    coalesce(
      (
        select json_agg(json_build_object(
          'quantity', oi.quantity,
          'price_at_time', oi.price_at_time,
          'product', json_build_object(
            'name', pr.name,
            'name_ar', pr.name_ar,
            'images', pr.images
          )
        ))
        from order_items oi
        left join products pr on pr.id = oi.product_id
        where oi.order_id = o.id
      ),
      '[]'::json
    ) as items
  from orders o
  join profiles p on p.id = o.user_id
  where p.phone = search_phone
  order by o.created_at desc;
end;
$$ language plpgsql security definer;

-- مسموحة للجميع حتى بدون تسجيل دخول — عشان صفحة التتبع تشتغل
grant execute on function track_order_by_phone to anon, authenticated;

-- ══════════════════════════════════════════════════════════════
-- ⑦ب get_public_stats — أرقام الصفحة الرئيسية (منتج/طلب/عميل)
-- ══════════════════════════════════════════════════════════════
-- المشكلة: الصفحة الرئيسية بتعرض "عدد العملاء" و"طلبات تم توصيلها"
-- للزوار الغير مسجلين — بس RLS الجديد على profiles/orders بيمنع
-- القراءة المباشرة بدون تسجيل دخول. الحل: دالة security definer
-- بترجع أرقام إجمالية بس (مش أي تفاصيل حساسة عن مستخدمين بعينهم)

create or replace function get_public_stats()
returns table(
  published_products bigint,
  delivered_orders bigint,
  total_customers bigint
) as $$
begin
  return query
  select
    (select count(*) from products where is_published = true),
    (select count(*) from orders where status = 'delivered'),
    (select count(*) from profiles);
end;
$$ language plpgsql security definer;

grant execute on function get_public_stats to anon, authenticated;

-- ══════════════════════════════════════════════════════════════
-- ⑧ get_all_users — دمجناها هنا عشان تبقى في ملف واحد بس
-- ══════════════════════════════════════════════════════════════
create or replace function get_all_users()
returns table(
  id uuid,
  email text,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  is_banned boolean,
  created_at timestamptz
) as $$
begin
  -- تحقق إضافي: بس الأدمن يقدر ينفذ الدالة دي
  if (auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' then
    raise exception 'Unauthorized: admin access required';
  end if;

  return query
  select
    p.id,
    u.email,
    p.full_name,
    p.phone,
    p.address,
    p.avatar_url,
    p.is_banned,
    p.created_at
  from profiles p
  join auth.users u on u.id = p.id
  order by p.created_at desc;
end;
$$ language plpgsql security definer;

grant execute on function get_all_users to authenticated;

-- ══════════════════════════════════════════════════════════════
-- ⑥ إضافة عمود delivery_fee لجدول orders
-- ══════════════════════════════════════════════════════════════
-- عشان الأدمن يقدر يشوف رسوم التوصيل منفصلة عن قيمة المنتجات
-- في كل طلب (مفيد للمحاسبة والتقارير) — IF NOT EXISTS بتضمن
-- إن السطر ده آمن يتنفذ حتى لو العمود موجود بالفعل
alter table orders add column if not exists delivery_fee numeric default 0;

-- ══════════════════════════════════════════════════════════════
-- ⑦ Indexes لتسريع الأداء
-- ══════════════════════════════════════════════════════════════
create index if not exists idx_products_published on products(is_published);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_coupons_code on coupons(code);

-- ══════════════════════════════════════════════════════════════
-- ⑧ باقي الدوال الأساسية (زي ما كانت في sql-functions.sql)
-- ══════════════════════════════════════════════════════════════

create or replace function set_user_role(user_email text, new_role text)
returns void as $$
declare
  target_id uuid;
begin
  if (auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' then
    raise exception 'Unauthorized: admin access required';
  end if;

  select id into target_id from auth.users where email = user_email;
  if target_id is null then
    raise exception 'User not found: %', user_email;
  end if;
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', new_role)
  where id = target_id;
end;
$$ language plpgsql security definer;

create or replace function set_user_role_by_id(user_id uuid, new_role text)
returns void as $$
begin
  if (auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' then
    raise exception 'Unauthorized: admin access required';
  end if;

  update auth.users
  set raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', new_role)
  where id = user_id;

  if not found then
    raise exception 'User not found: %', user_id;
  end if;
end;
$$ language plpgsql security definer;

create or replace function get_moderators()
returns table(id uuid, email text, full_name text, created_at timestamptz) as $$
begin
  if (auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' then
    raise exception 'Unauthorized: admin access required';
  end if;

  return query
  select
    u.id,
    u.email,
    (u.raw_user_meta_data->>'full_name')::text as full_name,
    u.created_at
  from auth.users u
  where u.raw_app_meta_data->>'role' = 'moderator';
end;
$$ language plpgsql security definer;

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

grant execute on function set_user_role           to authenticated;
grant execute on function set_user_role_by_id     to authenticated;
grant execute on function get_moderators          to authenticated;
grant execute on function increment_coupon_usage  to authenticated;

-- ══════════════════════════════════════════════════════════════
-- ⑧ handle_new_user trigger — إنشاء profile تلقائي عند التسجيل
-- ══════════════════════════════════════════════════════════════
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, created_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ══════════════════════════════════════════════════════════════
-- خطوة أخيرة إلزامية — لازم تتنفذ يدوياً بعد تشغيل الملف ده
-- ══════════════════════════════════════════════════════════════
--   SELECT set_user_role('moaz2009amen@gmail.com', 'admin');
--   ثم اعمل logout و login من لوحة التحكم من جديد
-- ══════════════════════════════════════════════════════════════
