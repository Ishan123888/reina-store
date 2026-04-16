-- Security hardening for authenticated customer-only storefront access
-- Date: 2026-04-15

alter table if exists public.products enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.profiles enable row level security;

-- Products: only authenticated users (customers/admins) can read products.
drop policy if exists "products_select_all" on public.products;

do $$
begin
  create policy "products_select_authenticated"
    on public.products
    for select
    to authenticated
    using (true);
exception
  when duplicate_object then null;
end $$;

-- Orders: keep owner/admin visibility and authenticated insert policy.
do $$
begin
  create policy "orders_select_own_or_admin"
    on public.orders
    for select
    using (
      auth.uid() = user_id
      or exists (
        select 1
        from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "orders_insert_authenticated"
    on public.orders
    for insert
    with check (auth.uid() = user_id);
exception
  when duplicate_object then null;
end $$;
