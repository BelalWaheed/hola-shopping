"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/auth/user-menu"
import { CartButton } from "@/components/cart/cart-button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { MiniCart } from "@/components/cart/mini-cart"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                Nexus
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-foreground/80 hover:text-foreground transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-foreground/80 hover:text-foreground transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <AnimatePresence>
                  {isSearchOpen ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 300, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center"
                    >
                      <Input placeholder="Search products..." className="pr-10" autoFocus />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)}>
                      <Search className="w-5 h-5" />
                    </Button>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />
              <CartButton />
              <UserMenu />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t border-border/50 py-4"
              >
                <div className="flex flex-col space-y-4">
                  <Link href="/products" className="text-foreground/80 hover:text-foreground transition-colors">
                    Products
                  </Link>
                  <Link href="/categories" className="text-foreground/80 hover:text-foreground transition-colors">
                    Categories
                  </Link>
                  <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <MiniCart />
    </>
  )
}
