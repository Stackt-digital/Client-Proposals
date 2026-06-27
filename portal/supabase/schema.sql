-- stackt Client Portal Schema
-- Run this in Supabase SQL editor

create extension if not exists "pgcrypto";

-- Clients table
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  logo_url text,
  hero_image_url text,
  about_text text,

  -- Integration configs
  clickup_list_id text,
  statusbrew_url text,
  figma_url text,
  gomarble_url text,
  google_drive_folder_id text,
  performance_planner_url text,
  strategy_pdf_url text,
  xero_invoice_url text,

  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Action items table
create table if not exists action_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  type text not null check (type in ('content_approval','performance_planner','invoice','creative_review','reporting')),
  title text not null,
  description text,
  url text,
  status text not null default 'pending' check (status in ('pending','completed')),
  due_date date,
  created_at timestamptz not null default now()
);

-- Admin users table (simple password-based auth for the team)
create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days'
);

-- Row level security: clients portal data is public (token gated at app level)
alter table clients enable row level security;
alter table action_items enable row level security;

create policy "Public read via token" on clients for select using (true);
create policy "Service role full access to clients" on clients using (auth.role() = 'service_role');

create policy "Public read action items" on action_items for select using (true);
create policy "Service role full access to action_items" on action_items using (auth.role() = 'service_role');

-- Sample client (update with real values)
insert into clients (name, slug, about_text)
values (
  'Demo Client',
  'demo-client',
  'Welcome to your stackt client portal. Here you can track progress, review deliverables, and stay aligned with your strategy.'
) on conflict do nothing;
