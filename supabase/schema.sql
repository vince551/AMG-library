-- AMG FOUNDATION Community Library
-- Production database blueprint for Supabase PostgreSQL.
-- Run after creating the Supabase project. Add storage buckets/policies separately.

create extension if not exists pgcrypto;

create type public.user_role as enum ('admin','librarian','teacher','learner','parent');
create type public.book_status as enum ('available','borrowed','reserved','overdue');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  role public.user_role not null default 'learner',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  isbn text,
  category text not null,
  subject text,
  form_level text,
  topic text,
  publisher text,
  publication_year int,
  shelf_location text,
  description text,
  cover_url text,
  total_copies int not null default 1 check (total_copies >= 0),
  available_copies int not null default 1 check (available_copies >= 0),
  digital_url text,
  digital_access boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete restrict,
  borrower_id uuid not null references public.profiles(id) on delete restrict,
  issued_by uuid references public.profiles(id),
  borrowed_at timestamptz not null default now(),
  due_at timestamptz not null,
  returned_at timestamptz,
  fine_amount numeric(10,2) not null default 0,
  status public.book_status not null default 'borrowed',
  created_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  resource_type text not null check (resource_type in ('notes','past_paper','quiz','ebook','video','flashcards','other')),
  subject text,
  form_level text,
  topic text,
  year int,
  file_url text,
  external_url text,
  uploaded_by uuid references public.profiles(id),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text,
  form_level text,
  topic text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_answer text not null,
  explanation text
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  score int not null default 0,
  total int not null default 0,
  attempted_at timestamptz not null default now()
);

create table public.reading_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid references public.books(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete cascade,
  minutes_read int not null default 0,
  progress_percent numeric(5,2) not null default 0,
  last_read_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge text not null,
  xp int not null default 0,
  awarded_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  channel text not null default 'web',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published_by uuid references public.profiles(id),
  published_at timestamptz not null default now(),
  expires_at timestamptz
);

create table public.parent_links (
  parent_id uuid not null references public.profiles(id) on delete cascade,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  primary key(parent_id, learner_id)
);

-- Basic RLS. Production policies should be tightened further according to the school's approval workflow.
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.loans enable row level security;
alter table public.reservations enable row level security;
alter table public.resources enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.reading_activity enable row level security;
alter table public.achievements enable row level security;
alter table public.notifications enable row level security;
alter table public.announcements enable row level security;
alter table public.parent_links enable row level security;

-- Public catalogue/resource discovery; private records remain role controlled.
create policy "catalogue readable" on public.books for select using (true);
create policy "approved resources readable" on public.resources for select using (approved = true);
create policy "announcements readable" on public.announcements for select using (true);

-- Authenticated users can read their own profile.
create policy "own profile readable" on public.profiles for select using (auth.uid() = id);
create policy "own loans readable" on public.loans for select using (auth.uid() = borrower_id);
create policy "own reservations readable" on public.reservations for select using (auth.uid() = user_id);
create policy "own attempts readable" on public.quiz_attempts for select using (auth.uid() = learner_id);
create policy "own reading activity readable" on public.reading_activity for select using (auth.uid() = user_id);
create policy "own achievements readable" on public.achievements for select using (auth.uid() = user_id);
create policy "own notifications readable" on public.notifications for select using (auth.uid() = user_id);

-- Add server-side role checks for librarian/admin writes before production launch.
