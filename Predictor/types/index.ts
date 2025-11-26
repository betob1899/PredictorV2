/**
 * Type definitions for the Time Predictor application
 */

export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  email?: string
  first_name: string
  last_name: string
  work_area: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  name: string
  start_time: string | null // HH:MM format, optional
  end_time: string | null // HH:MM format, optional
  actual_duration_minutes: number | null // Calculated duration in minutes, optional
  is_closed: boolean // When true, no more predictions can be submitted
  created_at: string
  updated_at: string
  created_by: string // Admin user ID
}

export interface Prediction {
  id: string
  user_id: string
  session_id: string
  predicted_time: string // HH:MM format
  predicted_minutes: number // Converted to minutes for comparison
  difference_minutes?: number // Difference from actual duration (calculated)
  created_at: string
  updated_at: string
  // Joined data
  user?: User
  session?: Session
}

export interface WinnerResult {
  user: User
  prediction: Prediction
  actual_duration: string // HH:MM format
  predicted_time: string // HH:MM format
  difference_minutes: number
  difference_display: string // Formatted difference
}

