"use client"

import { usePageView } from "@/lib/hooks/useAnalytics"

interface ProductsPageContentProps {
  productsCount: number
  categoriesCount: number
}

export function ProductsPageContent({ productsCount, categoriesCount }: ProductsPageContentProps) {
  usePageView("products", {
    products_count: productsCount,
    categories_count: categoriesCount,
  })

  return null
}
