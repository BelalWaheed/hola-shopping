"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { setCartItems, updateQuantity, removeFromCart } from "@/lib/store/slices/cartSlice"
import type { CartItem } from "@/lib/types"
import type { RootState } from "@/lib/store"
import Link from "next/link"

interface CartPageContentProps {
  initialCartItems: CartItem[]
}

export function CartPageContent({ initialCartItems }: CartPageContentProps) {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.cart)

  useEffect(() => {
    dispatch(setCartItems(initialCartItems))
  }, [dispatch, initialCartItems])

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

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
            <Link href="/products">
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground">Review your items and proceed to checkout when you're ready.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.svg?height=96&width=96"}
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{item.product?.name || "Unknown Product"}</h3>
                          {item.product?.category && (
                            <Badge variant="outline" className="mb-2">
                              {item.product.category.name}
                            </Badge>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.product?.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary">
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${item.product?.price?.toFixed(2) || "0.00"} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-24"
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${(totalPrice * 1.08).toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    size="lg"
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Secure checkout powered by industry-standard encryption
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
