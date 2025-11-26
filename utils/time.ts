/**
 * Utility functions for time calculations and validations
 * Handles HH:MM format conversions and time difference calculations
 */

/**
 * Validates if a string is in HH:MM format
 * @param time - Time string to validate (e.g., "14:30")
 * @returns true if valid, false otherwise
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

/**
 * Converts HH:MM format to total minutes
 * @param time - Time string in HH:MM format (e.g., "02:30")
 * @returns Total minutes (e.g., 150 for "02:30")
 * @throws Error if time format is invalid
 */
export function timeToMinutes(time: string): number {
  if (!isValidTimeFormat(time)) {
    throw new Error(`Invalid time format: ${time}. Expected HH:MM format.`)
  }

  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Converts total minutes to HH:MM format
 * @param minutes - Total minutes (e.g., 150)
 * @returns Time string in HH:MM format (e.g., "02:30")
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * Calculates the duration between two times in minutes
 * Handles cases where end time is on the next day
 * @param startTime - Start time in HH:MM format
 * @param endTime - End time in HH:MM format
 * @returns Duration in minutes
 * @throws Error if time formats are invalid
 */
export function calculateDuration(startTime: string, endTime: string): number {
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    throw new Error('Both start and end times must be in HH:MM format')
  }

  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)

  // Handle case where end time is on the next day
  if (endMinutes < startMinutes) {
    // Add 24 hours (1440 minutes) to end time
    return (1440 - startMinutes) + endMinutes
  }

  return endMinutes - startMinutes
}

/**
 * Calculates the absolute difference between predicted and actual duration
 * @param predictedMinutes - Predicted duration in minutes
 * @param actualMinutes - Actual duration in minutes
 * @returns Absolute difference in minutes
 */
export function calculateDifference(predictedMinutes: number, actualMinutes: number): number {
  return Math.abs(predictedMinutes - actualMinutes)
}

/**
 * Formats difference in minutes to a human-readable string
 * @param differenceMinutes - Difference in minutes
 * @returns Formatted string (e.g., "+15 min", "-5 min", "0 min")
 */
export function formatDifference(differenceMinutes: number): string {
  if (differenceMinutes === 0) {
    return '0 min'
  }

  const sign = differenceMinutes > 0 ? '+' : '-'
  const absDiff = Math.abs(differenceMinutes)

  if (absDiff < 60) {
    return `${sign}${absDiff} min`
  }

  const hours = Math.floor(absDiff / 60)
  const minutes = absDiff % 60

  if (minutes === 0) {
    return `${sign}${hours}h`
  }

  return `${sign}${hours}h ${minutes}min`
}

