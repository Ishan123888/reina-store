alter table public.orders
  add column if not exists customer_id uuid references auth.users (id);

update public.orders
set customer_id = user_id
where customer_id is null and user_id is not null;

create index if not exists orders_customer_id_idx on public.orders (customer_id);

drop policy if exists "orders_insert_authenticated" on public.orders;
drop policy if exists "orders_select_own_or_admin" on public.orders;

do $$
begin
  create policy "orders_insert_authenticated"
    on public.orders
    for insert
    with check (
      auth.uid() = customer_id
      or auth.uid() = user_id
    );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "orders_select_own_or_admin"
    on public.orders
    for select
    using (
      auth.uid() = customer_id
      or auth.uid() = user_id
      or exists (
        select 1
        from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    );
exception
  when duplicate_object then null;
end $$;
