"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Loader2 } from "lucide-react"
import { addToCart, toggleCart } from "@/lib/store/slices/cartSlice"
import { useAuth } from "@/lib/hooks/useAuth"
import { createClient } from "@/lib/supabase/client"
import { analytics } from "@/lib/hooks/useAnalytics"
import type { Product } from "@/lib/types"
import Swal from "sweetalert2"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "default",
  size = "default",
  className = "",
}: AddToCartButtonProps) {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Sign In Required",
        text: "Please sign in to add items to your cart",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sign In",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/auth/login"
        }
      })
      return
    }

    if (product.quantity <= 0) {
      Swal.fire({
        title: "Out of Stock",
        text: "This product is currently out of stock",
        icon: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user!.id)
        .eq("product_id", product.id)
        .single()

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq("id", existingItem.id)

        if (error) throw error

        dispatch(
          addToCart({
            id: existingItem.id,
            user_id: user!.id,
            product_id: product.id,
            product,
            quantity,
            created_at: existingItem.created_at,
            updated_at: new Date().toISOString(),
          }),
        )
      } else {
        // Create new cart item
        const { data: newItem, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user!.id,
            product_id: product.id,
            quantity,
          })
          .select()
          .single()

        if (error) throw error

        dispatch(
          addToCart({
            ...newItem,
            product,
          }),
        )
      }

      await analytics.trackAddToCart(product.id, quantity, {
        product_name: product.name,
        product_price: product.price,
        product_category: product.category?.name,
      })

      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)

      // Show success message
      Swal.fire({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      })

      // Optionally open cart
      setTimeout(() => dispatch(toggleCart()), 500)
    } catch (error) {
      console.error("Error adding to cart:", error)
      Swal.fire({
        title: "Error",
        text: "Failed to add item to cart. Please try again.",
        icon: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || product.quantity <= 0}
        variant={variant}
        size={size}
        className={`${className} ${isAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : isAdded ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <ShoppingCart className="w-4 h-4 mr-2" />
        )}
        {isLoading ? "Adding..." : isAdded ? "Added!" : "Add to Cart"}
      </Button>
    </motion.div>
  )
}
