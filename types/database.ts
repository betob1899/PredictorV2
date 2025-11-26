/**
 * Database types generated from Supabase schema
 * This should match your Supabase database structure
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          first_name: string
          last_name: string
          work_area: string
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          first_name: string
          last_name: string
          work_area: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          first_name?: string
          last_name?: string
          work_area?: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          name: string
          start_time: string | null
          end_time: string | null
          actual_duration_minutes: number | null
          is_closed: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          start_time?: string | null
          end_time?: string | null
          actual_duration_minutes?: number | null
          is_closed?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          start_time?: string | null
          end_time?: string | null
          actual_duration_minutes?: number | null
          is_closed?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      admin_auth: {
        Row: {
          id: string
          username: string
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          user_id: string
          session_id: string
          predicted_time: string
          predicted_minutes: number
          difference_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          predicted_time: string
          predicted_minutes: number
          difference_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          predicted_time?: string
          predicted_minutes?: number
          difference_minutes?: number | null
          created_at?: string
          updated_at?: string
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
      user_role: 'user' | 'admin'
    }
  }
}

