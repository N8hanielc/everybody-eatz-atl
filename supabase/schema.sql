-- ─────────────────────────────────────────────────────────────
--  Everybody Eatz ATL — Supabase schema
--  Run this once in Supabase: Dashboard → SQL Editor → New query →
--  paste this whole file → Run. It is safe to run again.
-- ─────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- ─────────────────────────── donations ───────────────────────────
-- Rows are written ONLY by the verified Stripe webhook (server-side).
-- amount_cents stores whole cents (e.g. $40.00 = 4000) to avoid rounding errors.
create table if not exists public.donations (
  id                          uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id  text not null unique,
  stripe_payment_intent_id    text unique,
  amount_cents                integer not null check (amount_cents > 0),
  currency                    text not null default 'usd',
  donor_display_name          text check (donor_display_name is null or char_length(donor_display_name) <= 40),
  is_anonymous                boolean not null default true,
  payment_status              text not null default 'paid'
                                check (payment_status in ('paid', 'refunded')),
  created_at                  timestamptz not null default now()
);

create index if not exists donations_status_created_idx
  on public.donations (payment_status, created_at desc);

-- ─────────────────────────── volunteers ───────────────────────────
create table if not exists public.volunteers (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null check (char_length(full_name) between 2 and 100),
  email           text not null check (char_length(email) <= 254),
  phone           text check (phone is null or char_length(phone) <= 30),
  volunteer_role  text not null check (volunteer_role in ('basket_assembly', 'distribution', 'both')),
  availability    text not null check (availability in ('before_event', 'event_day', 'both')),
  group_size      integer check (group_size is null or group_size between 1 and 50),
  notes           text check (notes is null or char_length(notes) <= 1000),
  created_at      timestamptz not null default now()
);

create index if not exists volunteers_created_idx on public.volunteers (created_at desc);

-- ─────────────────────── Row Level Security ───────────────────────
-- RLS is ON with NO public policies. That means the public "anon" key and
-- signed-in users can neither read nor write these tables.
-- The website's server code uses the service-role key (which bypasses RLS)
-- and only ever returns the aggregate total and donor names donors opted in to.
-- Organizers view everything in the Supabase dashboard (Table Editor).
alter table public.donations  enable row level security;
alter table public.volunteers enable row level security;

revoke all on table public.donations  from anon, authenticated;
revoke all on table public.volunteers from anon, authenticated;

-- ─────────────────────── Organizer convenience ───────────────────────
-- Friendly views for the dashboard (Table Editor → "views").
-- They are only accessible to the service role / dashboard, not the public.
create or replace view public.volunteer_signups_readable
with (security_invoker = true) as
select
  created_at,
  full_name,
  email,
  phone,
  case volunteer_role
    when 'basket_assembly' then 'Basket Assembly'
    when 'distribution' then 'Event-Day Distribution'
    else 'Both'
  end as role,
  case availability
    when 'before_event' then 'Before the event'
    when 'event_day' then 'Event day'
    else 'Both'
  end as availability,
  coalesce(group_size, 1) as group_size,
  notes
from public.volunteers
order by created_at desc;

create or replace view public.donation_totals
with (security_invoker = true) as
select
  count(*) filter (where payment_status = 'paid')                         as paid_donations,
  coalesce(sum(amount_cents) filter (where payment_status = 'paid'), 0) / 100.0 as total_raised,
  count(*) filter (where payment_status = 'refunded')                     as refunded_donations
from public.donations;

revoke all on public.volunteer_signups_readable from anon, authenticated;
revoke all on public.donation_totals from anon, authenticated;
