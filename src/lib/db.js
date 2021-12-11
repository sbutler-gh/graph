import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase

// -- Create a table for Public Users
// create table users (
//   id uuid references auth.users not null,
//   email text not null,
//   updated_at timestamp with time zone,

//   primary key (id)
// );

// alter table users enable row level security;

// create policy "Public users are viewable by everyone."
//   on users for select
//   using ( true );

// create policy "Users can insert their own user data."
//   on users for insert
//   with check ( auth.uid() = id );

// create policy "Users can update own user."
//   on users for update
//   using ( auth.uid() = id );

// create or replace function public.handle_new_user() 
// returns trigger as $$
// begin
//   insert into public.users (id, email)
//   values (new.id, new.email);
//   return new;
// end;
// $$ language plpgsql security definer;

// create trigger on_auth_user_created
//   after insert on auth.users
//   for each row execute procedure public.handle_new_user();