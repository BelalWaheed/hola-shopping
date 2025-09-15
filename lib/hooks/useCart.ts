"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createClient } from "@/lib/supabase/client"
import { setCartItems, setCartLoading } from "@/lib/store/slices/cartSlice"
import { useAuth } from "./useAuth"
import type { RootState } from "@/lib/store"

export function useCart() {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useAuth()
  const { items, isLoading } = useSelector((state: RootState) => state.cart)
  const supabase = createClient()

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartItems()
    } else {
      dispatch(setCartItems([]))
    }
  }, [isAuthenticated, user])

  const loadCartItems = async () => {
    if (!user) return

    dispatch(setCartLoading(true))
    try {
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products(
            *,
            category:categories(*)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      dispatch(setCartItems(cartItems || []))
    } catch (error) {
      console.error("Error loading cart items:", error)
    } finally {
      dispatch(setCartLoading(false))
    }
  }

  const syncCartItem = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await supabase.from("cart_items").delete().eq("id", itemId)
      } else {
        await supabase.from("cart_items").update({ quantity, updated_at: new Date().toISOString() }).eq("id", itemId)
      }
    } catch (error) {
      console.error("Error syncing cart item:", error)
    }
  }

  return {
    items,
    isLoading,
    loadCartItems,
    syncCartItem,
  }
}
