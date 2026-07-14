create extension if not exists pgcrypto;

create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_zh text not null,
  title_en text,
  description_zh text,
  description_en text,
  category_zh text[],
  category_en text[],
  cover_url text,
  hero_image_url text,
  badge text,
  is_vip boolean default false,
  is_featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  episode_count integer default 0,
  views integer default 0,
  followers integer default 0,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series(id) on delete cascade,
  title_zh text not null,
  title_en text,
  episode_number integer not null,
  description_zh text,
  description_en text,
  thumbnail_url text,
  preview_video_url text,
  full_video_url text,
  access_type text default 'vip' check (access_type in ('free', 'preview', 'vip')),
  duration text,
  release_date date,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  title_zh text not null,
  title_en text,
  subtitle_zh text,
  subtitle_en text,
  badge_zh text,
  badge_en text,
  episode_info_zh text,
  episode_info_en text,
  image_url text,
  series_slug text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  path text,
  payload jsonb,
  created_at timestamptz default now()
);

create index if not exists series_status_idx on series(status);
create index if not exists series_featured_idx on series(is_featured);
create index if not exists episodes_series_id_idx on episodes(series_id);
create index if not exists episodes_status_idx on episodes(status);
create index if not exists hero_slides_active_idx on hero_slides(is_active);

-- Public visitors can only read published content. Admin API routes use the
-- service role key, which bypasses RLS for CMS create/update/delete actions.
alter table series enable row level security;
alter table episodes enable row level security;
alter table hero_slides enable row level security;
alter table analytics_events enable row level security;

drop policy if exists "Public can read published series" on series;
create policy "Public can read published series"
on series for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read published episodes" on episodes;
create policy "Public can read published episodes"
on episodes for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1 from series
    where series.id = episodes.series_id
      and series.status = 'published'
  )
);

drop policy if exists "Public can read active hero slides" on hero_slides;
create policy "Public can read active hero slides"
on hero_slides for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can submit analytics events" on analytics_events;
create policy "Public can submit analytics events"
on analytics_events for insert
to anon, authenticated
with check (true);

insert into storage.buckets (id, name, public)
values
  ('series-covers', 'series-covers', true),
  ('series-heroes', 'series-heroes', true),
  ('episode-thumbnails', 'episode-thumbnails', true),
  ('hero-slides', 'hero-slides', true),
  ('episode-videos', 'episode-videos', true)
on conflict (id) do nothing;
