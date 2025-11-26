/**
 * Server Actions for user operations
 * Handles user registration and retrieval
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import type { User } from '@/types'

/**
 * Creates a new user (registration)
 * @param userData - User information
 * @returns Created user or error
 */
export async function createUser(userData: {
  firstName: string
  lastName: string
  workArea: string
  role?: 'user' | 'admin'
}) {
  try {
    const supabase = await createClient()

    // Check if user already exists (same first name + last name, case-insensitive)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, first_name, last_name')
      .ilike('first_name', userData.firstName.trim())
      .ilike('last_name', userData.lastName.trim())
      .single()

    if (existingUser) {
      // Return the existing user instead of error
      return {
        success: true,
        error: null,
        data: existingUser as User,
      }
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        first_name: userData.firstName.trim(),
        last_name: userData.lastName.trim(),
        work_area: userData.workArea.trim(),
        role: userData.role || 'user',
      })
      .select()
      .single()

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505' || error.message.includes('unique')) {
        return {
          success: false,
          error: `El usuario ${userData.firstName} ${userData.lastName} ya existe`,
          data: null,
        }
      }
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data: data as User }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }
  }
}

/**
 * Gets all users
 * @returns List of users
 */
export async function getAllUsers() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data: data as User[] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }
  }
}

/**
 * Gets a user by ID
 * @param userId - User ID
 * @returns User or error
 */
export async function getUserById(userId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data: data as User }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }
  }
}

/**
 * Gets a user by first name and last name (case-insensitive)
 * @param firstName - User first name
 * @param lastName - User last name
 * @returns User or error
 */
export async function getUserByFullName(firstName: string, lastName: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('first_name', firstName.trim())
      .ilike('last_name', lastName.trim())
      .single()

    if (error) {
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data: data as User }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }
  }
}

