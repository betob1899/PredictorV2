/**
 * Server Actions for prediction operations
 * Handles prediction creation, retrieval, and winner calculation
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { timeToMinutes, calculateDifference, isValidTimeFormat, minutesToTime, formatDifference } from '@/utils/time'
import type { Prediction, WinnerResult } from '@/types'

/**
 * Creates a new prediction for a user
 * @param predictionData - Prediction information
 * @returns Created prediction or error
 */
export async function createPrediction(predictionData: {
    userId: string
    sessionId: string
    predictedTime: string
}) {
    try {
        // Validate time format
        if (!isValidTimeFormat(predictionData.predictedTime)) {
            return {
                success: false,
                error: 'Invalid time format. Expected HH:MM',
                data: null,
            }
        }

        // Convert to minutes
        const predictedMinutes = timeToMinutes(predictionData.predictedTime)

        const supabase = await createClient()

        // Check if session is closed
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('id, is_closed, name')
            .eq('id', predictionData.sessionId)
            .single()

        if (sessionError || !session) {
            return {
                success: false,
                error: 'Sesión no encontrada',
                data: null,
            }
        }

        if (session.is_closed) {
            return {
                success: false,
                error: `La sesión "${session.name}" está cerrada. No se pueden ingresar más predicciones.`,
                data: null,
            }
        }

        // Check if user already has a prediction for this session
        const { data: existingUserPrediction } = await supabase
            .from('predictions')
            .select('id')
            .eq('user_id', predictionData.userId)
            .eq('session_id', predictionData.sessionId)
            .single()

        if (existingUserPrediction) {
            return {
                success: false,
                error: 'Ya has ingresado una predicción para esta sesión',
                data: null,
            }
        }

        // Check if this exact prediction time already exists for this session
        const { data: existingTimePrediction } = await supabase
            .from('predictions')
            .select('id, user:users(first_name, last_name)')
            .eq('session_id', predictionData.sessionId)
            .eq('predicted_time', predictionData.predictedTime)
            .single()

        if (existingTimePrediction) {
            const existingUser = existingTimePrediction.user as any
            return {
                success: false,
                error: `La predicción ${predictionData.predictedTime} ya fue ingresada por otro usuario (${existingUser?.first_name} ${existingUser?.last_name})`,
                data: null,
            }
        }

        const { data, error } = await supabase
            .from('predictions')
            .insert({
                user_id: predictionData.userId,
                session_id: predictionData.sessionId,
                predicted_time: predictionData.predictedTime,
                predicted_minutes: predictedMinutes,
            })
            .select()
            .single()

        if (error) {
            // Check for unique constraint violations
            if (error.code === '23505' || error.message.includes('unique')) {
                if (error.message.includes('user_id') && error.message.includes('session_id')) {
                    return {
                        success: false,
                        error: 'Ya has ingresado una predicción para esta sesión',
                        data: null,
                    }
                }
                if (error.message.includes('predicted_time')) {
                    return {
                        success: false,
                        error: `La predicción ${predictionData.predictedTime} ya fue ingresada por otro usuario para esta sesión`,
                        data: null,
                    }
                }
            }
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Prediction }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

/**
 * Gets all predictions for a session
 * @param sessionId - Session ID
 * @returns List of predictions with user data
 */
export async function getPredictionsBySession(sessionId: string) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('predictions')
            .select(`
        *,
        user:users(*),
        session:sessions(*)
      `)
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Prediction[] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

/**
 * Calculates differences for all predictions in a session
 * This should be called after the session ends (when actual times are set)
 * @param sessionId - Session ID
 * @returns Success status
 */
export async function calculatePredictionDifferences(sessionId: string) {
    try {
        const supabase = await createClient()

        // Get session to get actual duration
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('actual_duration_minutes')
            .eq('id', sessionId)
            .single()

        if (sessionError || !session) {
            return {
                success: false,
                error: 'Session not found',
                data: null,
            }
        }

        // Get all predictions for this session
        const { data: predictions, error: predictionsError } = await supabase
            .from('predictions')
            .select('id, predicted_minutes')
            .eq('session_id', sessionId)

        if (predictionsError) {
            return { success: false, error: predictionsError.message, data: null }
        }

        // Calculate and update differences
        const updates = predictions.map((prediction) => ({
            id: prediction.id,
            difference_minutes: calculateDifference(
                prediction.predicted_minutes,
                session.actual_duration_minutes
            ),
        }))

        // Update all predictions
        for (const update of updates) {
            const { error: updateError } = await supabase
                .from('predictions')
                .update({ difference_minutes: update.difference_minutes })
                .eq('id', update.id)

            if (updateError) {
                return { success: false, error: updateError.message, data: null }
            }
        }

        return { success: true, error: null, data: null }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

/**
 * Determines the winner for a session
 * @param sessionId - Session ID
 * @returns Winner result or error
 */
export async function getSessionWinner(sessionId: string): Promise<{
    success: boolean
    error: string | null
    data: WinnerResult | null
}> {
    try {
        const supabase = await createClient()

        // First, ensure differences are calculated
        await calculatePredictionDifferences(sessionId)

        // Get session data
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('actual_duration_minutes, start_time, end_time')
            .eq('id', sessionId)
            .single()

        if (sessionError || !session) {
            return {
                success: false,
                error: 'Session not found',
                data: null,
            }
        }

        // Get prediction with smallest difference
        const { data: winnerPrediction, error: predictionError } = await supabase
            .from('predictions')
            .select(`
        *,
        user:users(*)
      `)
            .eq('session_id', sessionId)
            .not('difference_minutes', 'is', null)
            .order('difference_minutes', { ascending: true })
            .limit(1)
            .single()

        if (predictionError || !winnerPrediction) {
            return {
                success: false,
                error: 'No predictions found for this session',
                data: null,
            }
        }

        // Format the result
        const actualDuration = minutesToTime(session.actual_duration_minutes)
        const differenceDisplay = formatDifference(winnerPrediction.difference_minutes!)

        const winnerResult: WinnerResult = {
            user: winnerPrediction.user as any,
            prediction: winnerPrediction as Prediction,
            actual_duration: actualDuration,
            predicted_time: winnerPrediction.predicted_time,
            difference_minutes: winnerPrediction.difference_minutes!,
            difference_display: differenceDisplay,
        }

        return { success: true, error: null, data: winnerResult }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

/**
 * Gets all predictions with user data
 * @returns List of all predictions
 */
export async function getAllPredictions() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('predictions')
            .select(`
        *,
        user:users(*),
        session:sessions(*)
      `)
            .order('created_at', { ascending: false })

        if (error) {
            return { success: false, error: error.message, data: null }
        }

        return { success: true, error: null, data: data as Prediction[] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null,
        }
    }
}

