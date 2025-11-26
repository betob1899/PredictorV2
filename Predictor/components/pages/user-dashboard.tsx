"use client"

import { useState, useEffect } from "react"
import { createUser } from "@/app/actions/users"
import { getAllSessions } from "@/app/actions/sessions"
import { createPrediction } from "@/app/actions/predictions"
import { isValidTimeFormat } from "@/utils/time"
import type { Session } from "@/types"

interface UserDashboardProps {
  onLogout: () => void
}

export default function UserDashboard({ onLogout }: UserDashboardProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [area, setArea] = useState("")
  const [time, setTime] = useState("")
  const [selectedSessionId, setSelectedSessionId] = useState<string>("")
  const [sessions, setSessions] = useState<Session[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load sessions on mount
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    const result = await getAllSessions()
    if (result.success && result.data) {
      setSessions(result.data)
      if (result.data.length > 0) {
        setSelectedSessionId(result.data[0].id)
      }
    }
  }

  const handleTimeChange = (value: string) => {
    // Auto-format HH:MM
    let formatted = value.replace(/\D/g, '')
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + ':' + formatted.slice(2, 4)
    }
    if (formatted.length <= 5) {
      setTime(formatted)
    }
  }

  const handleSubmit = async () => {
    setError(null)

    // Validation
    if (!firstName.trim() || !lastName.trim() || !area.trim() || !time.trim()) {
      setError("All fields are required")
      return
    }

    if (!isValidTimeFormat(time)) {
      setError("Invalid time format. Please use HH:MM (e.g., 02:30)")
      return
    }

    if (!selectedSessionId) {
      setError("Please select a session")
      return
    }

    setLoading(true)

    try {
      // First, create the user
      const userResult = await createUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        workArea: area.trim(),
        role: 'user',
      })

      if (!userResult.success || !userResult.data) {
        setError(userResult.error || "Failed to create user")
        setLoading(false)
        return
      }

      // Then, create the prediction
      const predictionResult = await createPrediction({
        userId: userResult.data.id,
        sessionId: selectedSessionId,
        predictedTime: time.trim(),
      })

      if (!predictionResult.success) {
        setError(predictionResult.error || "Failed to create prediction")
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 p-4">
      {/* Header */}
      <div className="nes-header mb-6 text-center">
        <h1 className="text-lg pixel-text">🎮 USER PREDICTION 🎮</h1>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {!submitted ? (
          <>
            {/* Form Panel */}
            <div className="nes-panel space-y-4">
              <h2 className="text-sm pixel-text" style={{ color: "#1a1a1a" }}>
                ENTER YOUR INFO
              </h2>

              <div>
                <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                  FIRST NAME
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={20}
                  className="nes-input"
                />
              </div>

              <div>
                <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                  LAST NAME
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={20}
                  className="nes-input"
                />
              </div>

              <div>
                <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                  AREA
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  maxLength={20}
                  className="nes-input"
                />
              </div>

              <div>
                <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                  SELECT SESSION
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="nes-input"
                  style={{ width: "100%" }}
                >
                  <option value="">-- Select Session --</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name} ({session.start_time} - {session.end_time})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                  TIME PREDICTION (HH:MM)
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  placeholder="02:30"
                  maxLength={5}
                  className="nes-input"
                />
                <p className="text-xs" style={{ color: "#666", marginTop: "4px" }}>
                  Format: HH:MM (e.g., 02:30 for 2 hours 30 minutes)
                </p>
              </div>

              {error && (
                <div className="text-xs" style={{ color: "#e74c3c", padding: "8px", backgroundColor: "#ffe0e0", border: "2px solid #e74c3c" }}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="nes-button w-full text-white success"
                style={{
                  fontSize: "10px",
                  padding: "12px",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "⏳ SUBMITTING..." : "✓ SUBMIT"}
              </button>

              <button
                onClick={onLogout}
                className="nes-button w-full text-white"
                style={{
                  backgroundColor: "#95a5a6",
                  fontSize: "10px",
                  padding: "12px",
                }}
              >
                ← LOGOUT
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success Panel */}
            <div className="nes-panel text-center space-y-4">
              <h2 className="text-sm pixel-text" style={{ color: "#27ae60" }}>
                PREDICTION SAVED!
              </h2>
              <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
                NAME: {firstName} {lastName}
              </p>
              <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
                AREA: {area}
              </p>
              <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
                TIME: {time}
              </p>
              <p className="text-lg pixel-text" style={{ color: "#3498db", marginTop: "16px" }}>
                ⭐ THANK YOU ⭐
              </p>
            </div>

            <button
              onClick={onLogout}
              className="nes-button w-full text-white"
              style={{
                backgroundColor: "#95a5a6",
                fontSize: "10px",
                padding: "12px",
              }}
            >
              ← LOGOUT
            </button>
          </>
        )}
      </div>
    </div>
  )
}
