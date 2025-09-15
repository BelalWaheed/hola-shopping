"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Palette, Sun, Moon, Zap, Monitor, Check, Settings } from "lucide-react"
import { setTheme } from "@/lib/store/slices/themeSlice"
import type { RootState } from "@/lib/store"
import type { Theme } from "@/lib/store/slices/themeSlice"

const themes = [
  {
    name: "Light",
    value: "light" as Theme,
    icon: Sun,
    description: "Clean and bright interface",
    preview: {
      background: "bg-white",
      card: "bg-gray-50",
      text: "text-gray-900",
      accent: "bg-blue-600",
    },
  },
  {
    name: "Dark",
    value: "dark" as Theme,
    icon: Moon,
    description: "Easy on the eyes",
    preview: {
      background: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-gray-100",
      accent: "bg-blue-500",
    },
  },
  {
    name: "Neon",
    value: "neon" as Theme,
    icon: Zap,
    description: "Cyberpunk aesthetic",
    preview: {
      background: "bg-black",
      card: "bg-gray-900",
      text: "text-cyan-400",
      accent: "bg-pink-500",
    },
  },
  {
    name: "Minimal",
    value: "minimal" as Theme,
    icon: Monitor,
    description: "Clean and simple",
    preview: {
      background: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-600",
      accent: "bg-gray-400",
    },
  },
]

export function ThemeCustomizer() {
  const dispatch = useDispatch()
  const { currentTheme } = useSelector((state: RootState) => state.theme)
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (newTheme: Theme) => {
    dispatch(setTheme(newTheme))
    applyTheme(newTheme)
  }

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    root.classList.remove("light", "dark", "neon", "minimal")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="sm" className="fixed bottom-6 right-6 z-50 shadow-lg bg-transparent">
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Theme Customizer</span>
          </SheetTitle>
          <SheetDescription>Choose your preferred theme and customize the appearance</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-sm font-medium mb-4">Choose Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <motion.div key={theme.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      currentTheme === theme.value ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"
                    }`}
                    onClick={() => handleThemeChange(theme.value)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Theme Preview */}
                        <div
                          className={`w-full h-16 rounded-md ${theme.preview.background} border relative overflow-hidden`}
                        >
                          <div className={`absolute top-2 left-2 w-8 h-3 rounded-sm ${theme.preview.card}`} />
                          <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${theme.preview.accent}`} />
                          <div
                            className={`absolute bottom-2 left-2 w-12 h-1 rounded-full ${theme.preview.text} opacity-60`}
                          />
                          <div
                            className={`absolute bottom-2 right-2 w-6 h-1 rounded-full ${theme.preview.text} opacity-40`}
                          />
                        </div>

                        {/* Theme Info */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <theme.icon className="w-4 h-4" />
                              <span className="font-medium text-sm">{theme.name}</span>
                            </div>
                            {currentTheme === theme.value && <Check className="w-4 h-4 text-primary" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{theme.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Current Theme Info */}
          <div>
            <h3 className="text-sm font-medium mb-3">Current Theme</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const current = themes.find((t) => t.value === currentTheme)
                    const Icon = current?.icon || Sun
                    return (
                      <>
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{current?.name || "Light"}</p>
                          <p className="text-xs text-muted-foreground">{current?.description || "Default theme"}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Theme Features */}
          <div>
            <h3 className="text-sm font-medium mb-3">Theme Features</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Dark Mode Support</span>
                <Badge variant="secondary">✓</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>System Preference</span>
                <Badge variant="secondary">✓</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Custom Colors</span>
                <Badge variant="secondary">✓</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Smooth Transitions</span>
                <Badge variant="secondary">✓</Badge>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
              handleThemeChange(systemTheme)
            }}
          >
            Reset to System
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
