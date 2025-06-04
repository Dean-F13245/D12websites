import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  created_at: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url?: string;
  technologies: string[];
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  project_status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}; 