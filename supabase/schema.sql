-- ==============================================================================
-- HOMESALE MARKETPLACE — COMPLETE PRODUCTION SUPABASE DATABASE SCHEMA & RLS
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase Auth auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role text not null check (role in ('customer', 'shopkeeper', 'delivery', 'admin')),
  status text not null default 'active' check (status in ('active', 'pending', 'suspended', 'rejected')),
  avatar_url text,
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- ------------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS FOR ROW LEVEL SECURITY
-- ------------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
end;
$$ language plpgsql security definer;

create or replace function public.get_shopkeeper_shop_id(user_uuid uuid)
returns uuid as $$
declare
  shop_uuid uuid;
begin
  select id into shop_uuid from public.shops
  where assigned_shopkeeper_id = user_uuid
  limit 1;
  return shop_uuid;
end;
$$ language plpgsql security definer;

-- ------------------------------------------------------------------------------
-- 3. SHOPS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null,
  tagline text,
  category text not null,
  description text,
  logo_url text,
  banner_url text,
  phone text not null,
  address text not null,
  area text not null,
  city text not null,
  state text default 'Karnataka',
  pincode text not null,
  latitude numeric(10, 6) default 12.9716,
  longitude numeric(10, 6) default 77.5946,
  opening_time text default '07:00 AM',
  closing_time text default '10:00 PM',
  is_open boolean default true,
  rating numeric(3, 1) default 4.8,
  review_count integer default 0,
  delivery_charge numeric(10, 2) default 30.00,
  estimated_delivery_time text default '20-30 min',
  status text not null default 'active' check (status in ('active', 'pending', 'suspended', 'rejected')),
  assigned_shopkeeper_id uuid references public.profiles(id) on delete set null,
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.shops enable row level security;

-- ------------------------------------------------------------------------------
-- 4. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon_name text,
  image_url text,
  item_count integer default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  category_id text references public.categories(id) on delete set null,
  category text not null,
  product_name text not null,
  description text,
  image_url text,
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  discount numeric(5, 2) default 0.00,
  stock_quantity integer default 100,
  unit text default '1 unit',
  is_available boolean default true,
  is_veg boolean default true,
  is_featured boolean default false,
  rating numeric(3, 1) default 4.8,
  review_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

-- ------------------------------------------------------------------------------
-- 6. CUSTOMER ADDRESSES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  house text not null,
  street text not null,
  area text not null,
  city text not null,
  state text not null default 'Karnataka',
  pincode text not null,
  delivery_instructions text,
  is_default boolean default false,
  tag text default 'Home' check (tag in ('Home', 'Work', 'Other')),
  created_at timestamptz default now()
);

alter table public.addresses enable row level security;

-- ------------------------------------------------------------------------------
-- 7. FAVORITE SHOPS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.favorite_shops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, shop_id)
);

alter table public.favorite_shops enable row level security;

-- ------------------------------------------------------------------------------
-- 8. DELIVERY ZONES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  area text,
  pincodes text[] not null default '{}',
  delivery_charge numeric(10, 2) default 30.00,
  minimum_order numeric(10, 2) default 150.00,
  is_active boolean default true,
  estimated_time_min integer default 25,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.delivery_zones enable row level security;

-- ------------------------------------------------------------------------------
-- 9. DELIVERY PARTNERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.delivery_partners (
  id uuid primary key references public.profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  email text not null,
  vehicle_type text default 'Bike' check (vehicle_type in ('Bike', 'Scooter', 'Bicycle', 'EV')),
  vehicle_number text,
  preferred_area text,
  rating numeric(3, 1) default 4.9,
  total_deliveries integer default 0,
  today_earnings numeric(10, 2) default 0.00,
  total_earnings numeric(10, 2) default 0.00,
  status text default 'active' check (status in ('active', 'on_delivery', 'offline')),
  approval_status text default 'active' check (approval_status in ('active', 'pending', 'suspended', 'rejected')),
  rejection_reason text,
  current_order_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.delivery_partners enable row level security;

-- ------------------------------------------------------------------------------
-- 10. ORDERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.profiles(id),
  customer_name text not null,
  customer_phone text not null,
  shop_id uuid not null references public.shops(id),
  shop_name text not null,
  shop_address text not null,
  shop_phone text not null,
  delivery_partner_id uuid references public.profiles(id),
  delivery_partner_name text,
  delivery_partner_phone text,
  address_id uuid references public.addresses(id) on delete set null,
  delivery_address_json jsonb not null,
  subtotal numeric(10, 2) not null,
  delivery_charge numeric(10, 2) not null default 30.00,
  grand_total numeric(10, 2) not null,
  payment_method text default 'COD' check (payment_method in ('COD', 'UPI', 'Card', 'NetBanking')),
  payment_status text default 'Pending' check (payment_status in ('Paid', 'Pending', 'Refunded')),
  order_status text not null default 'Order Placed' check (
    order_status in (
      'Order Placed',
      'Shopkeeper Accepted',
      'Preparing',
      'Ready for Pickup',
      'Delivery Partner Assigned',
      'Picked Up',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      'Rejected'
    )
  ),
  estimated_delivery_time text default '25 mins',
  status_history jsonb not null default '[]'::jsonb,
  cancellation_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

-- ------------------------------------------------------------------------------
-- 11. ORDER ITEMS TABLE (With immutable price snapshot)
-- ------------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  unit_snapshot text,
  image_snapshot text,
  price_snapshot numeric(10, 2) not null,
  quantity integer not null default 1,
  subtotal numeric(10, 2) not null,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

-- ------------------------------------------------------------------------------
-- 12. TRANSACTIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_id text not null unique,
  order_id uuid not null references public.orders(id) on delete cascade,
  order_number text not null,
  customer_id uuid not null references public.profiles(id),
  customer_name text not null,
  shop_id uuid not null references public.shops(id),
  shop_name text not null,
  amount numeric(10, 2) not null,
  delivery_charge numeric(10, 2) not null,
  total_amount numeric(10, 2) not null,
  payment_method text not null,
  payment_status text not null default 'Success',
  order_status text not null,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- PROFILES POLICIES
create policy "Public profiles read" on public.profiles
  for select using (true);

create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "Admin insert profiles" on public.profiles
  for insert with check (auth.uid() = id or public.is_admin());

create policy "Admin delete profiles" on public.profiles
  for delete using (public.is_admin());

-- SHOPS POLICIES
create policy "Anyone can view active approved shops" on public.shops
  for select using (
    status = 'active' or 
    assigned_shopkeeper_id = auth.uid() or 
    public.is_admin()
  );

create policy "Admin insert shops" on public.shops
  for insert with check (public.is_admin());

create policy "Admin and assigned Shopkeeper update shops" on public.shops
  for update using (
    public.is_admin() or 
    assigned_shopkeeper_id = auth.uid()
  );

create policy "Admin delete shops" on public.shops
  for delete using (public.is_admin());

-- CATEGORIES POLICIES
create policy "Public categories read" on public.categories
  for select using (true);

create policy "Admin manage categories" on public.categories
  for all using (public.is_admin());

-- PRODUCTS POLICIES
create policy "Anyone can view available products of active shops" on public.products
  for select using (
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and (
        s.status = 'active' or 
        s.assigned_shopkeeper_id = auth.uid() or 
        public.is_admin()
      )
    )
  );

create policy "Shopkeeper insert products to own shop" on public.products
  for insert with check (
    public.is_admin() or 
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and s.assigned_shopkeeper_id = auth.uid()
    )
  );

create policy "Shopkeeper update products of own shop" on public.products
  for update using (
    public.is_admin() or 
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and s.assigned_shopkeeper_id = auth.uid()
    )
  );

create policy "Shopkeeper delete products of own shop" on public.products
  for delete using (
    public.is_admin() or 
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and s.assigned_shopkeeper_id = auth.uid()
    )
  );

-- ADDRESSES POLICIES
create policy "Customers view own addresses" on public.addresses
  for select using (auth.uid() = user_id or public.is_admin());

create policy "Customers insert own addresses" on public.addresses
  for insert with check (auth.uid() = user_id or public.is_admin());

create policy "Customers update own addresses" on public.addresses
  for update using (auth.uid() = user_id or public.is_admin());

create policy "Customers delete own addresses" on public.addresses
  for delete using (auth.uid() = user_id or public.is_admin());

-- FAVORITE SHOPS POLICIES
create policy "Customers view own favorites" on public.favorite_shops
  for select using (auth.uid() = user_id or public.is_admin());

create policy "Customers insert own favorites" on public.favorite_shops
  for insert with check (auth.uid() = user_id or public.is_admin());

create policy "Customers delete own favorites" on public.favorite_shops
  for delete using (auth.uid() = user_id or public.is_admin());

-- DELIVERY ZONES POLICIES
create policy "Public delivery zones read" on public.delivery_zones
  for select using (true);

create policy "Admin manage delivery zones" on public.delivery_zones
  for all using (public.is_admin());

-- DELIVERY PARTNERS POLICIES
create policy "View delivery partners" on public.delivery_partners
  for select using (
    id = auth.uid() or 
    public.is_admin() or 
    status = 'active'
  );

create policy "Delivery partner update own profile" on public.delivery_partners
  for update using (id = auth.uid() or public.is_admin());

create policy "Admin manage delivery partners" on public.delivery_partners
  for all using (public.is_admin());

-- ORDERS POLICIES
create policy "Customers, Shopkeepers, Delivery Partners & Admin view relevant orders" on public.orders
  for select using (
    customer_id = auth.uid() or
    exists (
      select 1 from public.shops s
      where s.id = orders.shop_id and s.assigned_shopkeeper_id = auth.uid()
    ) or
    delivery_partner_id = auth.uid() or
    (delivery_partner_id is null and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'delivery'
    )) or
    public.is_admin()
  );

create policy "Customers insert orders" on public.orders
  for insert with check (customer_id = auth.uid() or public.is_admin());

create policy "Update orders by authorized roles" on public.orders
  for update using (
    customer_id = auth.uid() or
    exists (
      select 1 from public.shops s
      where s.id = orders.shop_id and s.assigned_shopkeeper_id = auth.uid()
    ) or
    delivery_partner_id = auth.uid() or
    (delivery_partner_id is null and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'delivery'
    )) or
    public.is_admin()
  );

-- ORDER ITEMS POLICIES
create policy "Order items visible to order participants" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and (
        o.customer_id = auth.uid() or
        exists (
          select 1 from public.shops s
          where s.id = o.shop_id and s.assigned_shopkeeper_id = auth.uid()
        ) or
        o.delivery_partner_id = auth.uid() or
        public.is_admin()
      )
    )
  );

create policy "Insert order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and (o.customer_id = auth.uid() or public.is_admin())
    )
  );

-- TRANSACTIONS POLICIES
create policy "Transactions viewable by participants" on public.transactions
  for select using (
    customer_id = auth.uid() or
    exists (
      select 1 from public.shops s
      where s.id = transactions.shop_id and s.assigned_shopkeeper_id = auth.uid()
    ) or
    public.is_admin()
  );

create policy "Insert transactions" on public.transactions
  for insert with check (
    customer_id = auth.uid() or public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- 13. AUTOMATIC PROFILE TRIGGER ON AUTH.USERS SIGNUP
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, role, status, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    coalesce(new.raw_user_meta_data->>'status', 'active'),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    phone = coalesce(excluded.phone, profiles.phone),
    role = coalesce(excluded.role, profiles.role),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 14. STORAGE BUCKETS CONFIGURATION (Run in Supabase dashboard or migrations)
-- ------------------------------------------------------------------------------
-- insert into storage.buckets (id, name, public) values ('shop-assets', 'shop-assets', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
