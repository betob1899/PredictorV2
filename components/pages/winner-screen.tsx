"use client"

import { useState, useEffect } from "react"
import { getSessionWinner } from "@/app/actions/predictions"
import type { WinnerResult } from "@/types"

interface WinnerScreenProps {
  onBack: () => void
  sessionId: string
}

export default function WinnerScreen({ onBack, sessionId }: WinnerScreenProps) {
  const [winner, setWinner] = useState<WinnerResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWinner()
  }, [sessionId])

  const loadWinner = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getSessionWinner(sessionId)
      if (result.success && result.data) {
        setWinner(result.data)
      } else {
        setError(result.error || "Failed to load winner")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Celebration */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h1
            className="text-2xl font-bold pixel-text"
            style={{ color: "#f1c40f", textShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}
          >
            YOU WIN!
          </h1>
        </div>

        {/* Winner Info Panel */}
        <div className="nes-panel text-center space-y-4">
          {loading ? (
            <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
              ⏳ LOADING WINNER...
            </p>
          ) : error ? (
            <div>
              <p className="text-xs pixel-text" style={{ color: "#e74c3c" }}>
                ⚠️ {error}
              </p>
            </div>
          ) : winner ? (
            <>
              <h2 className="text-sm pixel-text" style={{ color: "#e74c3c" }}>
                🌟 CONGRATULATIONS 🌟
              </h2>

              <div className="border-2 p-4" style={{ borderColor: "#1a1a1a", backgroundColor: "#ffe0e0" }}>
                <p className="text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                  WINNER
                </p>
                <p className="text-sm pixel-text font-bold" style={{ color: "#e74c3c" }}>
                  {winner.user.first_name} {winner.user.last_name}
                </p>
                <p className="text-xs pixel-text" style={{ color: "#666" }}>
                  Area: {winner.user.work_area}
                </p>
              </div>

              <div className="space-y-2">
                <div className="border-2 p-2" style={{ borderColor: "#1a1a1a", backgroundColor: "#cccccc" }}>
                  <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
                    ACTUAL TIME
                  </p>
                  <p className="text-sm pixel-text font-bold" style={{ color: "#3498db" }}>
                    {winner.actual_duration}
                  </p>
                </div>

                <div className="border-2 p-2" style={{ borderColor: "#1a1a1a", backgroundColor: "#cccccc" }}>
                  <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
                    PREDICTION
                  </p>
                  <p className="text-sm pixel-text font-bold" style={{ color: "#27ae60" }}>
                    {winner.predicted_time}
                  </p>
                </div>

                <div className="border-2 p-2" style={{ borderColor: "#1a1a1a", backgroundColor: "#e0ffe0" }}>
                  <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
                    DIFFERENCE
                  </p>
                  <p className="text-sm pixel-text font-bold" style={{ color: "#27ae60" }}>
                    {winner.difference_display}
                  </p>
                </div>
              </div>

              <p className="text-xs pixel-text" style={{ color: "#1a1a1a", marginTop: "16px" }}>
                ⭐ CLOSEST GUESS ⭐
              </p>
            </>
          ) : (
            <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
              NO WINNER FOUND
            </p>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="nes-button w-full text-white secondary"
          style={{
            fontSize: "10px",
            padding: "12px",
          }}
        >
          ← BACK TO ADMIN
        </button>
      </div>
    </div>
  )
}
