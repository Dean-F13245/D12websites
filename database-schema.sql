
-- Enable RLS (Row Level Security)
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create projects table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image_url text not null,
  project_url text,
  tags text[] default '{}',
  client_name text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create testimonials table
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  client_name text not null,
  business text not null,
  quote text not null,
  rating integer check (rating >= 1 and rating <= 5),
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contacts table
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  message text not null,
  status text default 'new' check (status in ('new', 'contacted', 'converted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create clients table
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text not null,
  website_url text,
  project_status text default 'inquiry' check (project_status in ('inquiry', 'planning', 'development', 'completed', 'maintenance')),
  package_type text default 'starter' check (package_type in ('starter', 'plus', 'pro', 'custom')),
  total_value decimal(10,2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.contacts enable row level security;
alter table public.clients enable row level security;

-- Create policies for public read access to projects and testimonials
create policy "Projects are publicly readable" on public.projects for select using (true);
create policy "Testimonials are publicly readable" on public.testimonials for select using (true);

-- Admin-only policies for CUD operations (will need to be adjusted based on your auth setup)
create policy "Only admins can manage projects" on public.projects for all using (auth.role() = 'admin');
create policy "Only admins can manage testimonials" on public.testimonials for all using (auth.role() = 'admin');
create policy "Only admins can manage contacts" on public.contacts for all using (auth.role() = 'admin');
create policy "Only admins can manage clients" on public.clients for all using (auth.role() = 'admin');

-- Create functions to update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.projects for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.testimonials for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.contacts for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.clients for each row execute procedure public.handle_updated_at();
