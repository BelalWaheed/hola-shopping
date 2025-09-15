"use client"

import { usePageView } from "@/lib/hooks/useAnalytics"

interface HomePageContentProps {
  featuredProducts: any[]
  categories: any[]
}

export function HomePageContent({ featuredProducts, categories }: HomePageContentProps) {
  usePageView("home", {
    featured_products_count: featuredProducts.length,
    categories_count: categories.length,
  })

  return null // This component only handles analytics tracking
}
