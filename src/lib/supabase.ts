import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
  console.error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    ...(typeof window !== 'undefined' && {
      providers: {
        google: {
          redirectTo: import.meta.env.PROD ? import.meta.env.VITE_PRODUCTION_URL : `${window.location.origin}`,
        },
      },
    }),
  },
});

export type Database = {
  public: {
    Tables: {
      votes: {
        Row: {
          id: string
          user_email: string
          house_number: number
          preferences: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_email: string
          house_number: number
          preferences: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_email?: string
          house_number?: number
          preferences?: string[]
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
