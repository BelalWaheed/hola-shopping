"use client"

import type React from "react"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setTheme, setSystemTheme } from "@/lib/store/slices/themeSlice"
import type { RootState } from "@/lib/store"
import type { Theme } from "@/lib/store/slices/themeSlice"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useDispatch()
  const { currentTheme } = useSelector((state: RootState) => state.theme)

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && ["light", "dark", "neon", "minimal"].includes(savedTheme)) {
      dispatch(setTheme(savedTheme))
      applyTheme(savedTheme)
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      dispatch(setTheme(systemTheme))
      dispatch(setSystemTheme(systemTheme))
      applyTheme(systemTheme)
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light"
      dispatch(setSystemTheme(newSystemTheme))

      // Only auto-switch if user hasn't manually selected a theme
      const savedTheme = localStorage.getItem("theme")
      if (!savedTheme || savedTheme === "system") {
        dispatch(setTheme(newSystemTheme))
        applyTheme(newSystemTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [dispatch])

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    root.classList.remove("light", "dark", "neon", "minimal")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }

  return <>{children}</>
}
