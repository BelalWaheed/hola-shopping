"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

export function usePageView(page: string, metadata?: Record<string, any>) {
  useEffect(() => {
    analytics.trackPageView(page, metadata)
  }, [page, metadata])
}

export function useProductView(productId: string, metadata?: Record<string, any>) {
  useEffect(() => {
    if (productId) {
      analytics.trackProductView(productId, metadata)
    }
  }, [productId, metadata])
}

export { analytics }
