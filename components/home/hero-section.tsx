"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"

export function HeroSection() {
  const { currentTheme } = useSelector((state: RootState) => state.theme)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl ${
            currentTheme === "neon" ? "animate-neon-pulse" : ""
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl ${
            currentTheme === "neon" ? "animate-neon-pulse" : ""
          }`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`inline-flex items-center space-x-2 bg-muted border border-border px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              currentTheme === "neon" ? "glow-border" : ""
            }`}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-foreground font-semibold">Introducing the Future of Shopping</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              currentTheme === "neon" ? "glow" : ""
            }`}
          >
            <span className="text-foreground">Discover Products</span>
            <br />
            <span className={`text-primary ${currentTheme === "neon" ? "glow" : ""}`}>Like Never Before</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Experience shopping reimagined with our innovative asymmetric layouts, interactive product discovery, and
            seamless user experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button
              asChild
              size="lg"
              className={`bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 font-semibold ${
                currentTheme === "neon" ? "neon-button" : ""
              }`}
            >
              <Link href="/products" className="flex items-center space-x-2">
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={`text-lg px-8 py-6 bg-transparent ${currentTheme === "neon" ? "neon-button" : ""}`}
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
