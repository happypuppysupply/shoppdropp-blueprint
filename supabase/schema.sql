-- ShoppDropp Database Schema
-- Run this in your Supabase SQL Editor

-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text default 'free',
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  status text default 'active',
  settings jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

create policy "Users can CRUD own projects" on projects
  for all using (auth.uid() = user_id);

-- Stores table
create table public.stores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references public.projects,
  name text not null,
  platform text not null, -- shopify, woocommerce, etc.
  url text,
  api_key text,
  api_secret text,
  settings jsonb default '{}',
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.stores enable row level security;

create policy "Users can CRUD own stores" on stores
  for all using (auth.uid() = user_id);

-- Products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  store_id uuid references public.stores,
  name text not null,
  description text,
  sku text,
  price decimal(10,2),
  cost decimal(10,2),
  inventory integer default 0,
  images text[],
  supplier_url text,
  category text,
  tags text[],
  status text default 'draft',
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Users can CRUD own products" on products
  for all using (auth.uid() = user_id);

-- Orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  store_id uuid references public.stores,
  order_number text,
  customer_email text,
  customer_name text,
  total decimal(10,2),
  status text default 'pending',
  shipping_address jsonb,
  line_items jsonb,
  platform_order_id text,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Users can CRUD own orders" on orders
  for all using (auth.uid() = user_id);

-- Ad Campaigns table
create table public.campaigns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  platform text not null, -- meta, tiktok, google
  objective text,
  budget decimal(10,2),
  spent decimal(10,2) default 0,
  status text default 'draft',
  targeting jsonb,
  creatives jsonb,
  platform_campaign_id text,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.campaigns enable row level security;

create policy "Users can CRUD own campaigns" on campaigns
  for all using (auth.uid() = user_id);

-- Activity Log table
create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null,
  message text not null,
  status text default 'pending',
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.activity_log enable row level security;

create policy "Users can view own activity" on activity_log
  for select using (auth.uid() = user_id);

-- Automation Rules table
create table public.automation_rules (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  trigger_type text not null,
  trigger_config jsonb not null,
  action_type text not null,
  action_config jsonb not null,
  is_active boolean default true,
  last_run timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.automation_rules enable row level security;

create policy "Users can CRUD own rules" on automation_rules
  for all using (auth.uid() = user_id);

-- Functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_store_id ON public.orders(store_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_stores_user_id ON public.stores(user_id);
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_activity_user_id ON public.activity_log(user_id);
