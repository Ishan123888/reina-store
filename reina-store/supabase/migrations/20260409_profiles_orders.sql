-- Suggested Supabase schema for Reina Store
-- Apply in Supabase SQL editor (or via supabase CLI if you use it).

-- Extensions
create extension if not exists pgcrypto;

-- Profiles (stores roles + customer delivery details)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  address text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read/write their own profile
do $$ begin
  create policy "profiles_select_own"
    on public.profiles for select
    using (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "profiles_upsert_own"
    on public.profiles for insert
    with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "profiles_update_own"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- Admin can read all profiles
do $$ begin
  create policy "profiles_select_admin"
    on public.profiles for select
    using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
exception when duplicate_object then null; end $$;

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  customer_name text not null,
  customer_email text,
  phone text not null,
  address text not null,
  items jsonb not null,
  subtotal_amount numeric,
  shipping_fee numeric not null default 350,
  total_amount numeric not null,
  status text not null default 'Pending',
  is_cod boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Customers can insert their own orders (authenticated)
do $$ begin
  create policy "orders_insert_authenticated"
    on public.orders for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Customers can view their own orders; admins can view all
do $$ begin
  create policy "orders_select_own_or_admin"
    on public.orders for select
    using (
      auth.uid() = user_id
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- Only admins can update order status
do $$ begin
  create policy "orders_update_admin_only"
    on public.orders for update
    using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
    with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
exception when duplicate_object then null; end $$;

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  price numeric not null,
  image_url text,
  stock_quantity integer not null default 100,
  colors text[] default array[]::text[],
  sizes text[] default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone can read products
do $$ begin
  create policy "products_select_all"
    on public.products for select
    using (true);
exception when duplicate_object then null; end $$;

-- Only admins can insert/update/delete products
do $$ begin
  create policy "products_write_admin"
    on public.products for insert
    with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "products_update_admin"
    on public.products for update
    using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
    with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "products_delete_admin"
    on public.products for delete
    using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
exception when duplicate_object then null; end $$;
