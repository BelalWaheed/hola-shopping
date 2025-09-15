export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: "customer" | "admin"
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  cost_per_item?: number
  sku?: string
  barcode?: string
  track_quantity: boolean
  quantity: number
  weight?: number
  category_id?: string
  category?: Category
  status: "draft" | "active" | "archived"
  featured: boolean
  tags: string[]
  images: string[]
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  product?: Product
  quantity: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total_amount: number
  shipping_address?: any
  billing_address?: any
  payment_status: "pending" | "paid" | "failed" | "refunded"
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  price: number
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  user_id?: string
  product_id?: string
  session_id?: string
  metadata?: any
  created_at: string
}
