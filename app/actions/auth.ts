/**
 * Server Actions for admin authentication
 * Handles admin login with username and password
 */

'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Authenticates an admin user
 * @param username - Admin username
 * @param password - Admin password
 * @returns Success status and admin data
 */
export async function loginAdmin(username: string, password: string) {
  try {
    const supabase = await createClient()

    // Get admin by username
    const { data: admin, error: adminError } = await supabase
      .from('admin_auth')
      .select('id, username, password_hash')
      .eq('username', username.trim())
      .single()

    if (adminError || !admin) {
      return {
        success: false,
        error: 'Usuario o contraseña incorrectos',
        data: null,
      }
    }

    // Verify password using pgcrypto
    const { data: passwordCheck, error: passwordError } = await supabase
      .rpc('verify_password', {
        password_hash: admin.password_hash,
        password_input: password,
      })

    // If RPC doesn't exist, use direct comparison (for development)
    // In production, use proper password hashing
    if (passwordError) {
      // Fallback: simple check (NOT SECURE - only for development)
      // In production, use bcrypt or similar
      const isValid = admin.password_hash === password
      if (!isValid) {
        return {
          success: false,
          error: 'Usuario o contraseña incorrectos',
          data: null,
        }
      }
    } else if (!passwordCheck) {
      return {
        success: false,
        error: 'Usuario o contraseña incorrectos',
        data: null,
      }
    }

    return {
      success: true,
      error: null,
      data: {
        id: admin.id,
        username: admin.username,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de autenticación',
      data: null,
    }
  }
}

/**
 * Creates a new admin user (for initial setup)
 * @param username - Admin username
 * @param password - Admin password (will be hashed)
 * @returns Created admin or error
 */
export async function createAdmin(username: string, password: string) {
  try {
    const supabase = await createClient()

    // Check if admin already exists
    const { data: existing } = await supabase
      .from('admin_auth')
      .select('id')
      .eq('username', username.trim())
      .single()

    if (existing) {
      return {
        success: false,
        error: 'El usuario administrador ya existe',
        data: null,
      }
    }

    // Hash password using pgcrypto crypt function
    // For now, we'll store it as plain text (NOT SECURE - only for development)
    // In production, use bcrypt or similar before storing
    const passwordHash = password // TODO: Hash password properly

    const { data, error } = await supabase
      .from('admin_auth')
      .insert({
        username: username.trim(),
        password_hash: passwordHash,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear administrador',
      data: null,
    }
  }
}

