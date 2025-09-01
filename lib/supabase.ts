import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Profile {
  id: string
  username: string
  full_name?: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  user_id: string
  title: string
  description?: string
  prep_time?: number
  cook_time?: number
  servings?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine?: string
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  dietary_restrictions?: string[]
  ingredients: any // JSONB data
  instructions: any // JSONB data
  image_url?: string
  is_public: boolean
  created_at: string
  updated_at: string
  // Relations
  profile?: Profile
}