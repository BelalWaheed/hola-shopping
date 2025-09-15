"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Palette, Monitor } from "lucide-react"
import { setTheme } from "@/lib/store/slices/themeSlice"
import type { RootState } from "@/lib/store"

export function ThemeToggle() {
  const dispatch = useDispatch()
  const { currentTheme } = useSelector((state: RootState) => state.theme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as any
    if (savedTheme) {
      dispatch(setTheme(savedTheme))
      applyTheme(savedTheme)
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      dispatch(setTheme(systemTheme))
      applyTheme(systemTheme)
    }
  }, [dispatch])

  const applyTheme = (theme: string) => {
    const root = document.documentElement
    root.classList.remove("light", "dark", "neon", "minimal")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem("theme", theme)
  }

  const handleThemeChange = (newTheme: any) => {
    dispatch(setTheme(newTheme))
    applyTheme(newTheme)
  }

  if (!mounted) {
    return <Button variant="ghost" size="sm" className="w-9 h-9 p-0" />
  }

  const getThemeIcon = () => {
    switch (currentTheme) {
      case "light":
        return Sun
      case "dark":
        return Moon
      case "neon":
        return Palette
      case "minimal":
        return Monitor
      default:
        return Sun
    }
  }

  const ThemeIcon = getThemeIcon()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
            <ThemeIcon className="w-4 h-4" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="w-4 h-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("neon")}>
          <Palette className="w-4 h-4 mr-2" />
          Neon
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("minimal")}>
          <Monitor className="w-4 h-4 mr-2" />
          Minimal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
