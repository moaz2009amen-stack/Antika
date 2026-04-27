-- ── دالة جلب كل المستخدمين للأدمن ──────────────────────────────
-- الصق ده في Supabase SQL Editor

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
