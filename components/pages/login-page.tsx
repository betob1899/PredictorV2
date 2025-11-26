"use client"

import { useState } from "react"
import { loginAdmin } from "@/app/actions/auth"

interface LoginPageProps {
  onLogin: (type: "user" | "admin") => void
  onAdminLogin: (adminData: { id: string; username: string }) => void
}

export default function LoginPage({ onLogin, onAdminLogin }: LoginPageProps) {
  const [mode, setMode] = useState<"select" | "admin-login">("select")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdminLogin = async () => {
    setError(null)
    
    if (!username.trim() || !password.trim()) {
      setError("Usuario y contraseña son requeridos")
      return
    }

    setLoading(true)

    try {
      const result = await loginAdmin(username.trim(), password)
      
      if (!result.success || !result.data) {
        setError(result.error || "Error de autenticación")
        setLoading(false)
        return
      }

      onAdminLogin(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  if (mode === "admin-login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-400 to-red-300 p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1
              className="text-2xl font-bold pixel-text"
              style={{ color: "#1a1a1a", textShadow: "2px 2px 0 rgba(255,255,255,0.3)" }}
            >
              ⚙️ ADMIN LOGIN ⚙️
            </h1>
          </div>

          {/* Login Panel */}
          <div className="nes-panel space-y-4">
            <div>
              <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                USUARIO
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="nes-input"
                placeholder="Ingresa tu usuario"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs pixel-text" style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                CONTRASEÑA
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="nes-input"
                placeholder="Ingresa tu contraseña"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleAdminLogin()
                  }
                }}
              />
            </div>

            {error && (
              <div className="text-xs" style={{ color: "#e74c3c", padding: "8px", backgroundColor: "#ffe0e0", border: "2px solid #e74c3c" }}>
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAdminLogin}
                disabled={loading}
                className="nes-button flex-1 text-white success"
                style={{
                  fontSize: "10px",
                  padding: "12px",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "⏳ INICIANDO..." : "✓ INGRESAR"}
              </button>
              <button
                onClick={() => {
                  setMode("select")
                  setUsername("")
                  setPassword("")
                  setError(null)
                }}
                disabled={loading}
                className="nes-button text-white"
                style={{
                  fontSize: "10px",
                  padding: "12px",
                  backgroundColor: "#95a5a6",
                }}
              >
                ←
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-200 p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1
            className="text-3xl font-bold pixel-text"
            style={{ color: "#e74c3c", textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
          >
            TIME
          </h1>
          <h1
            className="text-3xl font-bold pixel-text"
            style={{ color: "#3498db", textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
          >
            PREDICTOR
          </h1>
        </div>

        {/* Main Panel */}
        <div className="nes-panel space-y-6">
          <div className="text-center">
            <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
              SELECT MODE
            </p>
          </div>

          {/* User Button */}
          <button
            onClick={() => onLogin("user")}
            className="nes-button w-full text-white secondary"
            style={{
              fontSize: "10px",
              padding: "12px",
            }}
          >
            👤 USER
          </button>

          {/* Admin Button */}
          <button
            onClick={() => setMode("admin-login")}
            className="nes-button w-full text-white"
            style={{
              fontSize: "10px",
              padding: "12px",
            }}
          >
            ⚙️ ADMIN
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs pixel-text" style={{ color: "#1a1a1a" }}>
            ⭐ PRESS START ⭐
          </p>
        </div>
      </div>
    </div>
  )
}
