"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Eye, Edit } from "lucide-react"
import Link from "next/link"
import type { Order, Product } from "@/lib/types"

interface DashboardData {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  recentOrders: (Order & { profiles?: { full_name?: string; email: string } })[]
  topProducts: Product[]
}

interface DashboardOverviewProps {
  data: DashboardData
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const stats = [
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No orders yet</p>
                ) : (
                  data.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <div>
                        <p className="font-medium">
                          {order.profiles?.full_name || order.profiles?.email || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "processing"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Products</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products">Manage Products</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No products yet</p>
                ) : (
                  data.topProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0">
                        <img
                          src={product.images[0] || "/placeholder.svg?height=48&width=48"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/products/${product.slug}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/admin/products/new">
                  <Package className="w-6 h-6" />
                  <span>Add Product</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href="/admin/orders">
                  <ShoppingCart className="w-6 h-6" />
                  <span>View Orders</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href="/admin/analytics">
                  <TrendingUp className="w-6 h-6" />
                  <span>View Analytics</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
