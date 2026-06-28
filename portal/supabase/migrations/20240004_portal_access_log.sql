create table if not exists portal_access_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  accessed_at timestamptz not null default now()
);

create index if not exists portal_access_log_client_id_idx on portal_access_log(client_id);
create index if not exists portal_access_log_accessed_at_idx on portal_access_log(accessed_at desc);
