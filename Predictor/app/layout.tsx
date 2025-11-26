import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import "./globals.css"

const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "8-Bit Time Predictor",
  description: "Mario Bros themed time prediction competition",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={pressStart.className}>{children}</body>
    </html>
  )
}
