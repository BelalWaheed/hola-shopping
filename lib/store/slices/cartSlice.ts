import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem } from "@/lib/types"

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.product_id === action.payload.product_id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCartItems, addToCart, updateQuantity, removeFromCart, clearCart, toggleCart, setCartLoading } =
  cartSlice.actions

export default cartSlice.reducer
