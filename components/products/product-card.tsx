"use client"

import { motion } from "framer-motion"
import type { Product } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { useProductView } from "@/lib/hooks/useAnalytics"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useProductView(product.id, {
    product_name: product.name,
    product_price: product.price,
    product_category: product.category?.name,
  })

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="group">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <div className="aspect-square relative bg-muted/20">
            <img
              src={product.images[0] || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && <div className="absolute inset-0 bg-muted/20 animate-pulse" />}
          </div>

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-black">
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-black" asChild>
              <Link href={`/products/${product.slug}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
            {discountPercentage > 0 && <Badge variant="destructive">-{discountPercentage}%</Badge>}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            {/* Category */}
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category.name}
              </Badge>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.compare_at_price && (
                <span className="text-muted-foreground line-through text-sm">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <span className={`text-xs ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
              </span>
              <div className="flex space-x-1">
                {product.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton product={product} className="w-full" disabled={product.quantity <= 0} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
