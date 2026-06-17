-- Future Supabase schema for ZEN Motion Comics Universe.

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  path text not null,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  plan text,
  status text,
  current_period_end timestamptz
);
