"use client"

import { useState, useEffect } from "react"
import { createSession, getAllSessions, updateSessionTimes, closeSession, openSession } from "@/app/actions/sessions"
import { getPredictionsBySession } from "@/app/actions/predictions"
import { createUser } from "@/app/actions/users"
import { isValidTimeFormat, minutesToTime } from "@/utils/time"
import type { Session, Prediction } from "@/types"

interface AdminDashboardProps {
  onLogout: () => void
  onShowWinner: (sessionId: string) => void
  adminData: { id: string; username: string }
}

export default function AdminDashboard({ onLogout, onShowWinner, adminData }: AdminDashboardProps) {
  const [sessionName, setSessionName] = useState("")
  const [sessions, setSessions] = useState<Session[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [selectedSessionForPredictions, setSelectedSessionForPredictions] = useState<string>("")
  const [selectedSessionForTimes, setSelectedSessionForTimes] = useState<string>("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [activeTab, setActiveTab] = useState<"manage" | "sessions" | "predictions" | "times">("manage")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adminUserId, setAdminUserId] = useState<string | null>(null)

  // Initialize admin user on mount
  useEffect(() => {
    initializeAdmin()
    loadSessions()
  }, [])

  // Load predictions when session is selected
  useEffect(() => {
    if (selectedSessionForPredictions) {
      loadPredictions(selectedSessionForPredictions)
    }
  }, [selectedSessionForPredictions])

  const initializeAdmin = async () => {
    // Create or get admin user record
    const result = await createUser({
      firstName: "Admin",
      lastName: adminData.username,
      workArea: "Administration",
      role: "admin",
    })
    if (result.success && result.data) {
      // Use the user ID from the users table (not admin_auth)
      setAdminUserId(result.data.id)
    } else {
      // If there's an error, try to get the existing user
      const { getUserByFullName } = await import("@/app/actions/users")
      const userResult = await getUserByFullName("Admin", adminData.username)
      if (userResult.success && userResult.data) {
        setAdminUserId(userResult.data.id)
      } else {
        setError("No se pudo obtener el usuario administrador. Por favor, recarga la página.")
      }
    }
  }

  const loadSessions = async () => {
    const result = await getAllSessions()
    if (result.success && result.data) {
      setSessions(result.data)
    }
  }

  const loadPredictions = async (sessionId: string) => {
    const result = await getPredictionsBySession(sessionId)
    if (result.success && result.data) {
      setPredictions(result.data)
    }
  }

  const handleTimeChange = (value: string, setter: (val: string) => void) => {
    // Auto-format HH:MM
    let formatted = value.replace(/\D/g, '')
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + ':' + formatted.slice(2, 4)
    }
    if (formatted.length <= 5) {
      setter(formatted)
    }
  }

  const handleCreateSession = async () => {
    setError(null)

    if (!sessionName.trim()) {
      setError("El nombre de la sesión es requerido")
      return
    }

    if (!adminUserId) {
      setError("Admin user not initialized. Please refresh the page.")
      return
    }

    setLoading(true)

    try {
      const result = await createSession(
        {
          name: sessionName.trim(),
        },
        adminUserId
      )

      if (!result.success) {
        setError(result.error || "Error al crear sesión")
        return
      }

      // Reset form
      setSessionName("")
      
      // Reload sessions
      await loadSessions()
      
      // Switch to sessions tab
      setActiveTab("sessions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSessionTimes = async (sessionId: string) => {
    setError(null)

    if (!isValidTimeFormat(startTime)) {
      setError("Formato de hora de inicio inválido. Use HH:MM")
      return
    }

    if (!isValidTimeFormat(endTime)) {
      setError("Formato de hora final inválido. Use HH:MM")
      return
    }

    setLoading(true)

    try {
      const result = await updateSessionTimes(sessionId, startTime.trim(), endTime.trim())

      if (!result.success) {
        setError(result.error || "Error al actualizar tiempos")
        return
      }

      // Reset form
      setStartTime("")
      setEndTime("")
      setSelectedSessionForTimes("")
      
      // Reload sessions
      await loadSessions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSession = async (sessionId: string, isClosed: boolean) => {
    setLoading(true)
    try {
      const result = isClosed ? await openSession(sessionId) : await closeSession(sessionId)
      if (result.success) {
        await loadSessions()
      } else {
        setError(result.error || "Error al cambiar estado de sesión")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-400 to-red-300 p-4">
      {/* Header */}
      <div className="nes-header mb-6 text-center" style={{ backgroundColor: "#e74c3c" }}>
        <h1 className="text-lg pixel-text">⚙️ ADMIN PANEL ⚙️</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          <button
            onClick={() => setActiveTab("manage")}
            className="nes-button text-white text-xs"
            style={{
              backgroundColor: activeTab === "manage" ? "#e74c3c" : "#95a5a6",
              padding: "8px 12px",
            }}
          >
            MANAGE
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className="nes-button text-white text-xs"
            style={{
              backgroundColor: activeTab === "sessions" ? "#e74c3c" : "#95a5a6",
              padding: "8px 12px",
            }}
          >
            SESSIONS
          </button>
          <button
            onClick={() => setActiveTab("predictions")}
            className="nes-button text-white text-xs"
            style={{
              backgroundColor: activeTab === "predictions" ? "#e74c3c" : "#95a5a6",
              padding: "8px 12px",
            }}
          >
            PREDICTIONS
          </button>
          <button
            onClick={() => setActiveTab("times")}
            className="nes-button text-white text-xs"
            style={{
              backgroundColor: activeTab === "times" ? "#e74c3c" : "#95a5a6",
              padding: "8px 12px",
            }}
          >
            TIMES
          </button>
        </div>

        {/* Manage Tab */}
        {activeTab === "manage" && (
          <div className="nes-panel space-y-4 mb-6">
            <h2 className="text-sm pixel-text" style={{ color: "#1a1a1a", marginBottom: "16px" }}>
              CREAR SESIÓN
            </h2>
            <p className="text-xs" style={{ color: "#666", marginBottom: "12px" }}>
              Crea una nueva sesión. Los tiempos se ingresarán después de que los usuarios hayan enviado sus predicciones.
            </p>

            <div>
              <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                NOMBRE DE SESIÓN
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                maxLength={50}
                className="nes-input"
                placeholder="Nombre de la sesión"
              />
            </div>

            {error && (
              <div className="text-xs" style={{ color: "#e74c3c", padding: "8px", backgroundColor: "#ffe0e0", border: "2px solid #e74c3c" }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleCreateSession}
              disabled={loading}
              className="nes-button w-full text-white success"
              style={{
                fontSize: "10px",
                padding: "10px",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "⏳ CREANDO..." : "✓ CREAR SESIÓN"}
            </button>
          </div>
        )}

        {/* Times Tab */}
        {activeTab === "times" && (
          <div className="nes-panel space-y-4 mb-6">
            <h2 className="text-sm pixel-text" style={{ color: "#1a1a1a", marginBottom: "16px" }}>
              INGRESAR TIEMPOS
            </h2>
            <p className="text-xs" style={{ color: "#666", marginBottom: "12px" }}>
              Ingresa los tiempos de inicio y fin para una sesión después de que los usuarios hayan enviado sus predicciones.
            </p>

            <div>
              <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                SELECCIONAR SESIÓN
              </label>
              <select
                value={selectedSessionForTimes}
                onChange={(e) => setSelectedSessionForTimes(e.target.value)}
                className="nes-input"
                style={{ width: "100%" }}
              >
                <option value="">-- Seleccionar Sesión --</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name} {session.is_closed ? "(Cerrada)" : "(Abierta)"}
                  </option>
                ))}
              </select>
            </div>

            {selectedSessionForTimes && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                      HORA INICIO (HH:MM)
                    </label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => handleTimeChange(e.target.value, setStartTime)}
                      placeholder="09:00"
                      maxLength={5}
                      className="nes-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                      HORA FIN (HH:MM)
                    </label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => handleTimeChange(e.target.value, setEndTime)}
                      placeholder="11:30"
                      maxLength={5}
                      className="nes-input"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs" style={{ color: "#e74c3c", padding: "8px", backgroundColor: "#ffe0e0", border: "2px solid #e74c3c" }}>
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={() => handleUpdateSessionTimes(selectedSessionForTimes)}
                  disabled={loading}
                  className="nes-button w-full text-white success"
                  style={{
                    fontSize: "10px",
                    padding: "10px",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "⏳ GUARDANDO..." : "✓ GUARDAR TIEMPOS"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === "sessions" && (
          <div className="nes-panel space-y-4 mb-6">
            <h2 className="text-sm pixel-text" style={{ color: "#1a1a1a", marginBottom: "16px" }}>
              TODAS LAS SESIONES
            </h2>
            {sessions.length === 0 ? (
              <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
                NO HAY SESIONES AÚN
              </p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border-2 p-2"
                    style={{ 
                      borderColor: "#1a1a1a", 
                      backgroundColor: session.is_closed ? "#ffe0e0" : "#e0ffe0" 
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs pixel-text font-bold">{session.name}</p>
                      <span className="text-xs pixel-text" style={{ color: session.is_closed ? "#e74c3c" : "#27ae60" }}>
                        {session.is_closed ? "🔒 CERRADA" : "🔓 ABIERTA"}
                      </span>
                    </div>
                    {session.start_time && session.end_time ? (
                      <>
                        <p className="text-xs pixel-text">
                          {session.start_time} → {session.end_time}
                        </p>
                        {session.actual_duration_minutes !== null && (
                          <p className="text-xs pixel-text" style={{ color: "#27ae60" }}>
                            DURACIÓN: {minutesToTime(session.actual_duration_minutes)}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs pixel-text" style={{ color: "#f39c12" }}>
                        ⏳ Tiempos no ingresados aún
                      </p>
                    )}
                    <p className="text-xs pixel-text" style={{ color: "#666" }}>
                      Creada: {new Date(session.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleToggleSession(session.id, session.is_closed)}
                      disabled={loading}
                      className="nes-button text-white text-xs mt-2"
                      style={{
                        backgroundColor: session.is_closed ? "#27ae60" : "#e74c3c",
                        fontSize: "8px",
                        padding: "6px 10px",
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      {session.is_closed ? "🔓 ABRIR SESIÓN" : "🔒 CERRAR SESIÓN"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === "predictions" && (
          <div className="nes-panel space-y-4 mb-6">
            <h2 className="text-sm pixel-text" style={{ color: "#1a1a1a", marginBottom: "16px" }}>
              USER PREDICTIONS
            </h2>
            
            <div>
              <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                SELECT SESSION
              </label>
              <select
                value={selectedSessionForPredictions}
                onChange={(e) => setSelectedSessionForPredictions(e.target.value)}
                className="nes-input"
                style={{ width: "100%" }}
              >
                <option value="">-- Select Session --</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedSessionForPredictions && (
              <div className="space-y-2">
                {predictions.length === 0 ? (
                  <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
                    NO PREDICTIONS YET FOR THIS SESSION
                  </p>
                ) : (
                  predictions.map((prediction) => {
                    const user = prediction.user as any
                    return (
                      <div
                        key={prediction.id}
                        className="border-2 p-2"
                        style={{ borderColor: "#1a1a1a", backgroundColor: "#ffe0e0" }}
                      >
                        <p className="text-xs pixel-text font-bold">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs pixel-text">
                          AREA: {user?.work_area}
                        </p>
                        <p className="text-xs pixel-text" style={{ color: "#3498db" }}>
                          PREDICTION: {prediction.predicted_time}
                        </p>
                        {prediction.difference_minutes !== null && (
                          <p className="text-xs pixel-text" style={{ color: "#27ae60" }}>
                            DIFFERENCE: {prediction.difference_minutes} min
                          </p>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
              SELECT SESSION FOR WINNER
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onShowWinner(e.target.value)
                }
              }}
              className="nes-input"
              style={{ width: "100%", marginBottom: "8px" }}
            >
              <option value="">-- Select Session --</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
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
        </div>
      </div>
    </div>
  )
}
