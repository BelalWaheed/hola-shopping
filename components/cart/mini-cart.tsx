"use client"

import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { toggleCart, updateQuantity, removeFromCart } from "@/lib/store/slices/cartSlice"
import type { RootState } from "@/lib/store"
import Link from "next/link"
import { useState, useRef } from "react"

export function MiniCart() {
  const dispatch = useDispatch()
  const { items, isOpen } = useSelector((state: RootState) => state.cart)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragRef = useRef<HTMLDivElement>(null)

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + price * item.quantity
  }, 0)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId))
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => dispatch(toggleCart())}
          />

          {/* Mini Cart */}
          <motion.div
            ref={dragRef}
            initial={{ opacity: 0, scale: 0.9, x: 300 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 300 }}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            className={`fixed top-20 right-4 z-50 w-96 max-h-[80vh] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ x: position.x, y: position.y }}
          >
            <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shopping Cart</span>
                  {itemCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {itemCount}
                    </Badge>
                  )}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => dispatch(toggleCart())} className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Your cart is empty</p>
                    <Button
                      onClick={() => dispatch(toggleCart())}
                      className="bg-gradient-to-r from-primary to-primary/80"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted/20 flex-shrink-0">
                            <img
                              src={item.product?.images?.[0] || "/placeholder.svg?height=48&width=48"}
                              alt={item.product?.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{item.product?.name || "Unknown Product"}</h4>
                            <p className="text-xs text-muted-foreground">
                              ${item.product?.price?.toFixed(2) || "0.00"} each
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="border-t border-border/50 pt-4 space-y-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-primary">${totalPrice.toFixed(2)}</span>
                      </div>

                      <div className="space-y-2">
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                          onClick={() => dispatch(toggleCart())}
                        >
                          <Link href="/checkout">Checkout</Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => dispatch(toggleCart())}
                          asChild
                        >
                          <Link href="/cart">View Full Cart</Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
