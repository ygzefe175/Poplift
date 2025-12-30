-- Supabase schema for Conversion System

-- 1. Profiles table (user profiles)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;

create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- 2. Automatic profile creation (on sign‑up)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Popups table (pop‑up campaigns)
create table popups (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text check (type in ('exit_intent', 'scroll', 'time_based', 'custom', 'urgency', 'gift', 'standard')) not null,
  headline text not null,
  subtext text not null,
  cta_text text not null,
  cta_url text default null, -- Optional redirect URL when CTA is clicked
  position text default 'center',
  delay_seconds integer default 5, -- For time_based popups
  scroll_percent integer default 50, -- For scroll popups
  is_active boolean default true,
  impressions integer default 0,
  clicks integer default 0,
  conversions integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table popups enable row level security;

create policy "Users can view own popups" 
  on popups for select 
  using (auth.uid() = user_id);

create policy "Users can create own popups" 
  on popups for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own popups" 
  on popups for update 
  using (auth.uid() = user_id);

create policy "Users can delete own popups" 
  on popups for delete 
  using (auth.uid() = user_id);

-- 4. Analytics table (statistics)
create table analytics (
  id uuid default uuid_generate_v4() primary key,
  popup_id uuid references popups on delete cascade not null,
  event_type text check (event_type in ('impression', 'click', 'conversion', 'close')) not null,
  visitor_tag text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table analytics enable row level security;

create policy "Users can view analytics for own popups" 
  on analytics for select 
  using (
    exists (
      select 1 from popups 
      where popups.id = analytics.popup_id 
      and popups.user_id = auth.uid()
    )
  );

create policy "Anyone can insert analytics" 
  on analytics for insert 
  with check (true);
