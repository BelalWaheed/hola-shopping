"use client"

import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { toggleCart } from "@/lib/store/slices/cartSlice"
import type { RootState } from "@/lib/store"

export function CartButton() {
  const dispatch = useDispatch()
  const { items, isOpen } = useSelector((state: RootState) => state.cart)

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + price * item.quantity
  }, 0)

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button variant="ghost" size="sm" className="relative" onClick={() => dispatch(toggleCart())}>
        <ShoppingCart className="w-5 h-5" />
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
            >
              {itemCount}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}
