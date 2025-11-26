"use client"

import { useState } from "react"
import LoginPage from "@/components/pages/login-page"
import UserDashboard from "@/components/pages/user-dashboard"
import AdminDashboard from "@/components/pages/admin-dashboard"
import WinnerScreen from "@/components/pages/winner-screen"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"login" | "user" | "admin" | "winner">("login")
  const [userType, setUserType] = useState<"user" | "admin" | null>(null)
  const [selectedSessionId, setSelectedSessionId] = useState<string>("")
  const [adminData, setAdminData] = useState<{ id: string; username: string } | null>(null)

  const handleLogin = (type: "user" | "admin") => {
    setUserType(type)
    if (type === "user") {
      setCurrentPage("user")
    }
    // Admin login is handled separately via handleAdminLogin
  }

  const handleAdminLogin = (data: { id: string; username: string }) => {
    setAdminData(data)
    setUserType("admin")
    setCurrentPage("admin")
  }

  const handleLogout = () => {
    setCurrentPage("login")
    setUserType(null)
    setSelectedSessionId("")
    setAdminData(null)
  }

  const handleShowWinner = (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setCurrentPage("winner")
  }

  return (
    <main className="min-h-screen bg-blue-200">
      {currentPage === "login" && <LoginPage onLogin={handleLogin} onAdminLogin={handleAdminLogin} />}
      {currentPage === "user" && <UserDashboard onLogout={handleLogout} />}
      {currentPage === "admin" && adminData && (
        <AdminDashboard 
          onLogout={handleLogout} 
          onShowWinner={handleShowWinner} 
          adminData={adminData}
        />
      )}
      {currentPage === "winner" && selectedSessionId && (
        <WinnerScreen onBack={() => setCurrentPage("admin")} sessionId={selectedSessionId} />
      )}
    </main>
  )
}
