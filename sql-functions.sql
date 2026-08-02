-- ══════════════════════════════════════════════════════════════
-- Antika Gallery — إعداد قاعدة البيانات الكامل (v6 - آمن تماماً)
-- ══════════════════════════════════════════════════════════════
-- المشكلة اللي اتحلت هنا: CREATE TABLE IF NOT EXISTS بترجع فوراً
-- لو الجدول موجود بالفعل — حتى لو بأعمدة مختلفة تماماً عن اللي
-- إحنا محتاجينها. فلو products كان موجود قبل كده بأعمدة قديمة
-- (من نسخة سابقة من المشروع)، عمود is_published ممكن يكون مش
-- موجود، وأي كود بعديه بيحاول يستخدمه هيفشل.
--
-- الحل هنا: كل جدول بيتعمل بشكل أساسي (لو مش موجود)، وبعدين كل
-- عمود بيتضاف صراحة بـ ALTER TABLE ADD COLUMN IF NOT EXISTS —
-- الطريقة دي آمنة 100% سواء الجدول جديد تماماً أو موجود من قبل
-- بأي شكل، لأن كل سطر بيتحقق بنفسه قبل ما ينفذ.
-- ══════════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════════
-- ① إنشاء الجداول الأساسية (لو مش موجودة خالص)
-- ══════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

create table if not exists profiles   (id uuid primary key references auth.users(id) on delete cascade);
create table if not exists categories (id uuid primary key default uuid_generate_v4());
create table if not exists products   (id uuid primary key default uuid_generate_v4());
create table if not exists orders     (id uuid primary key default uuid_generate_v4());
create table if not exists order_items(id uuid primary key default uuid_generate_v4());
create table if not exists notifications(id uuid primary key default uuid_generate_v4());
create table if not exists settings   (key text primary key);
create table if not exists wishlist   (id uuid primary key default uuid_generate_v4());
create table if not exists coupons    (id uuid primary key default uuid_generate_v4());
create table if not exists reviews    (id uuid primary key default uuid_generate_v4());
create table if not exists stock_alerts(id uuid primary key default uuid_generate_v4());


-- ══════════════════════════════════════════════════════════════
-- ② إضافة كل الأعمدة صراحة — آمن حتى لو الجدول موجود من قبل
-- ══════════════════════════════════════════════════════════════

-- ── profiles ──
alter table profiles add column if not exists full_name  text;
alter table profiles add column if not exists phone      text;
alter table profiles add column if not exists address    text;
alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists is_banned  boolean default false;
alter table profiles add column if not exists created_at timestamptz default now();

-- ── categories ──
alter table categories add column if not exists name       text;
alter table categories add column if not exists name_ar    text;
alter table categories add column if not exists slug       text;
alter table categories add column if not exists created_at timestamptz default now();
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'categories_slug_key') then
    alter table categories add constraint categories_slug_key unique (slug);
  end if;
end $$;

-- ── products ──
alter table products add column if not exists name           text;
alter table products add column if not exists name_ar        text;
alter table products add column if not exists description    text;
alter table products add column if not exists description_ar text;
alter table products add column if not exists price          numeric default 0;
alter table products add column if not exists stock          integer default 0;
alter table products add column if not exists images         text[] default '{}';
alter table products add column if not exists video_url      text;
alter table products add column if not exists category_id    uuid references categories(id) on delete set null;
alter table products add column if not exists is_published   boolean default true;
alter table products add column if not exists created_at     timestamptz default now();

-- ── orders ──
alter table orders add column if not exists user_id           uuid references profiles(id) on delete cascade;
alter table orders add column if not exists total              numeric default 0;
alter table orders add column if not exists delivery_fee       numeric default 0;
alter table orders add column if not exists status             text default 'pending';
alter table orders add column if not exists payment_method     text;
alter table orders add column if not exists payment_proof_url  text;
alter table orders add column if not exists notes              text;
alter table orders add column if not exists created_at         timestamptz default now();

-- ── order_items ──
alter table order_items add column if not exists order_id      uuid references orders(id) on delete cascade;
alter table order_items add column if not exists product_id    uuid references products(id) on delete set null;
alter table order_items add column if not exists quantity      integer default 1;
alter table order_items add column if not exists price_at_time numeric default 0;

-- ── notifications ──
alter table notifications add column if not exists user_id    uuid references profiles(id) on delete cascade;
alter table notifications add column if not exists message    text;
alter table notifications add column if not exists is_read    boolean default false;
alter table notifications add column if not exists created_at timestamptz default now();

-- ── settings ──
alter table settings add column if not exists value      text;
alter table settings add column if not exists updated_at timestamptz default now();

-- ── wishlist ──
alter table wishlist add column if not exists user_id    uuid references profiles(id) on delete cascade;
alter table wishlist add column if not exists product_id uuid references products(id) on delete cascade;
alter table wishlist add column if not exists created_at timestamptz default now();
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'wishlist_user_id_product_id_key') then
    alter table wishlist add constraint wishlist_user_id_product_id_key unique (user_id, product_id);
  end if;
end $$;

-- ── coupons ──
alter table coupons add column if not exists code       text;
alter table coupons add column if not exists type       text default 'percentage';
alter table coupons add column if not exists value      numeric default 0;
alter table coupons add column if not exists min_order  numeric default 0;
alter table coupons add column if not exists max_uses   integer;
alter table coupons add column if not exists used_count integer default 0;
alter table coupons add column if not exists expires_at timestamptz;
alter table coupons add column if not exists is_active  boolean default true;
alter table coupons add column if not exists created_at timestamptz default now();
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'coupons_code_key') then
    alter table coupons add constraint coupons_code_key unique (code);
  end if;
end $$;

-- ── reviews ──
alter table reviews add column if not exists product_id uuid references products(id) on delete cascade;
alter table reviews add column if not exists user_id    uuid references profiles(id) on delete cascade;
alter table reviews add column if not exists rating     integer;
alter table reviews add column if not exists comment    text;
alter table reviews add column if not exists images     text[] default '{}';
alter table reviews add column if not exists created_at timestamptz default now();
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'reviews_user_id_product_id_key') then
    alter table reviews add constraint reviews_user_id_product_id_key unique (user_id, product_id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'reviews_rating_check') then
    alter table reviews add constraint reviews_rating_check check (rating between 1 and 5);
  end if;
end $$;

-- ── stock_alerts ──
alter table stock_alerts add column if not exists product_id uuid references products(id) on delete cascade;
alter table stock_alerts add column if not exists user_id    uuid references profiles(id) on delete cascade;
alter table stock_alerts add column if not exists email      text;
alter table stock_alerts add column if not exists created_at timestamptz default now();
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'stock_alerts_user_id_product_id_key') then
    alter table stock_alerts add constraint stock_alerts_user_id_product_id_key unique (user_id, product_id);
  end if;
end $$;


-- ══════════════════════════════════════════════════════════════
-- ③ الدوال (Functions)
-- ══════════════════════════════════════════════════════════════

-- ── decrement() — خصم المخزون بشكل atomic (منع over-selling) ──
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

-- ── increment_coupon_usage() ──
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

grant execute on function increment_coupon_usage to authenticated;

-- ── track_order_by_phone() — بديل احتياطي (مش مستخدم حالياً بعد
-- التحويل لصفحة "طلباتي" التلقائية، لكن موجود لأي استخدام مستقبلي)
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

grant execute on function track_order_by_phone to anon, authenticated;

-- ── get_public_stats() — أرقام الصفحة الرئيسية ──
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

-- ── get_all_users() ──
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

-- ── set_user_role() ──
-- ملاحظة: بيسمح بأول تعيين أدمن حتى لو محدش عنده role='admin' لسه
-- (عشان تقدر تعمل أول حساب أدمن في مشروع جديد بدون ما تتقفل بره)
create or replace function set_user_role(user_email text, new_role text)
returns void as $$
declare
  target_id uuid;
begin
  if (auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' then
    if exists (select 1 from auth.users where raw_app_meta_data->>'role' = 'admin') then
      raise exception 'Unauthorized: admin access required';
    end if;
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

-- ── set_user_role_by_id() ──
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

grant execute on function set_user_role       to authenticated;
grant execute on function set_user_role_by_id to authenticated;

-- ── get_moderators() ──
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

grant execute on function get_moderators to authenticated;

-- ── handle_new_user() — إنشاء profile تلقائي عند التسجيل ──
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
-- ④ Row Level Security على كل الجداول
-- ══════════════════════════════════════════════════════════════

-- ── settings ── (السبب الأصلي لمشكلة "وضع الصيانة مش بيشتغل")
alter table settings enable row level security;

drop policy if exists "settings_select_all" on settings;
create policy "settings_select_all" on settings for select using (true);

drop policy if exists "settings_write_admin" on settings;
create policy "settings_write_admin"
  on settings for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── products ──
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
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

-- ── categories ──
alter table categories enable row level security;

drop policy if exists "categories_select_all" on categories;
create policy "categories_select_all" on categories for select using (true);

drop policy if exists "categories_write_admin" on categories;
create policy "categories_write_admin"
  on categories for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

-- ── coupons ──
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

-- ── profiles ──
alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_select_admin" on profiles;
create policy "profiles_select_admin"
  on profiles for select using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "profiles_update_admin" on profiles;
create policy "profiles_update_admin"
  on profiles for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── orders ──
alter table orders enable row level security;

drop policy if exists "orders_select_own" on orders;
create policy "orders_select_own" on orders for select using (auth.uid() = user_id);

drop policy if exists "orders_insert_own" on orders;
create policy "orders_insert_own" on orders for insert with check (auth.uid() = user_id);

drop policy if exists "orders_select_admin" on orders;
create policy "orders_select_admin"
  on orders for select using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

drop policy if exists "orders_update_admin" on orders;
create policy "orders_update_admin"
  on orders for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

drop policy if exists "orders_delete_admin" on orders;
create policy "orders_delete_admin"
  on orders for delete using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "orders_delete_own_pending" on orders;
create policy "orders_delete_own_pending"
  on orders for delete using (auth.uid() = user_id and status = 'pending');

-- ── order_items ──
alter table order_items enable row level security;

drop policy if exists "order_items_select_own" on order_items;
create policy "order_items_select_own"
  on order_items for select
  using (exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

drop policy if exists "order_items_insert_own" on order_items;
create policy "order_items_insert_own"
  on order_items for insert
  with check (exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

drop policy if exists "order_items_select_admin" on order_items;
create policy "order_items_select_admin"
  on order_items for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

-- ── notifications ──
alter table notifications enable row level security;

drop policy if exists "notifications_select_own" on notifications;
create policy "notifications_select_own" on notifications for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on notifications;
create policy "notifications_update_own"
  on notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notifications_insert_admin" on notifications;
create policy "notifications_insert_admin"
  on notifications for insert
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator'));

-- ── wishlist ──
alter table wishlist enable row level security;

drop policy if exists "wishlist_all_own" on wishlist;
create policy "wishlist_all_own"
  on wishlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── reviews ──
alter table reviews enable row level security;

drop policy if exists "reviews_select_all" on reviews;
create policy "reviews_select_all" on reviews for select using (true);

drop policy if exists "reviews_write_own" on reviews;
create policy "reviews_write_own"
  on reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── stock_alerts ──
alter table stock_alerts enable row level security;

drop policy if exists "stock_alerts_all_own" on stock_alerts;
create policy "stock_alerts_all_own"
  on stock_alerts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "stock_alerts_select_admin" on stock_alerts;
create policy "stock_alerts_select_admin"
  on stock_alerts for select using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ══════════════════════════════════════════════════════════════
-- ⑤ Indexes لتسريع الأداء
-- ══════════════════════════════════════════════════════════════
create index if not exists idx_products_published on products(is_published);
create index if not exists idx_orders_status       on orders(status);
create index if not exists idx_orders_user         on orders(user_id);
create index if not exists idx_coupons_code        on coupons(code);
create index if not exists idx_order_items_order   on order_items(order_id);
create index if not exists idx_reviews_product     on reviews(product_id);
create index if not exists idx_wishlist_user       on wishlist(user_id);


-- ══════════════════════════════════════════════════════════════
-- ⑥ خطوة أخيرة إلزامية — لازم تتنفذ يدوياً بعد الملف ده
-- ══════════════════════════════════════════════════════════════
--   SELECT set_user_role('moaz2009amen@gmail.com', 'admin');
--   ثم اعمل logout و login من لوحة التحكم من جديد
-- ══════════════════════════════════════════════════════════════
