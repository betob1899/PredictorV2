/**
 * Server Actions for session operations
 * Handles session creation, retrieval, and management
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateDuration, isValidTimeFormat } from '@/utils/time'
import type { Session } from '@/types'

/**
 * Creates a new session (admin only)
 * No start/end times required - they can be set later
 * @param sessionData - Session information
 * @param adminUserId - Admin user ID creating the session
 * @returns Created session or error
 */
export async function createSession(
    sessionData: {
        name: string
    },
    adminUserId: string
) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .insert({
                name: sessionData.name.trim(),
                start_time: null,
                end_time: null,
                actual_duration_minutes: null,
                is_closed: false,
                created_by: adminUserId,
            })
            .select()
            .single()

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Session }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

/**
 * Updates session times (sets start and end time, calculates duration)
 * @param sessionId - Session ID
 * @param startTime - Start time in HH:MM format
 * @param endTime - End time in HH:MM format
 * @returns Updated session or error
 */
export async function updateSessionTimes(
    sessionId: string,
    startTime: string,
    endTime: string
) {
    try {
        // Validate time formats
        if (!isValidTimeFormat(startTime)) {
            return {
                success: false,
                error: 'Formato de hora de inicio inválido. Use HH:MM',
                data: null,
            }
        }

        if (!isValidTimeFormat(endTime)) {
            return {
                success: false,
                error: 'Formato de hora final inválido. Use HH:MM',
                data: null,
            }
        }

        // Calculate actual duration
        const actualDurationMinutes = calculateDuration(startTime, endTime)

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .update({
                start_time: startTime,
                end_time: endTime,
                actual_duration_minutes: actualDurationMinutes,
            })
            .eq('id', sessionId)
            .select()
            .single()

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Session }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
            data: null,
        }
    }
}

/**
 * Closes a session (prevents new predictions)
 * @param sessionId - Session ID
 * @returns Updated session or error
 */
export async function closeSession(sessionId: string) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .update({ is_closed: true })
            .eq('id', sessionId)
            .select()
            .single()

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Session }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
            data: null,
        }
    }
}

/**
 * Opens a session (allows new predictions)
 * @param sessionId - Session ID
 * @returns Updated session or error
 */
export async function openSession(sessionId: string) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .update({ is_closed: false })
            .eq('id', sessionId)
            .select()
            .single()

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Session }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
            data: null,
        }
    }
}

/**
 * Gets all sessions
 * @returns List of sessions
 */
export async function getAllSessions() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Session[] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

/**
 * Gets a session by ID
 * @param sessionId - Session ID
 * @returns Session or error
 */
export async function getSessionById(sessionId: string) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .single()

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Session }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

/**
 * Gets active sessions (sessions that haven't ended yet)
 * For simplicity, we'll return all sessions - you can add time-based filtering later
 * @returns List of active sessions
 */
export async function getActiveSessions() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Session[] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

