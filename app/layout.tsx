import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Nexus Store - Innovative E-commerce",
  description: "Experience shopping like never before with our innovative e-commerce platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <ThemeProvider>
            {children}
            <ThemeCustomizer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
