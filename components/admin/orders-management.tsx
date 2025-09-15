"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import type { Order, OrderItem, Product } from "@/lib/types"

interface ExtendedOrder extends Order {
  profiles?: { full_name?: string; email: string }
  order_items?: (OrderItem & { product?: Pick<Product, "name" | "images"> })[]
}

interface OrdersManagementProps {
  orders: ExtendedOrder[]
}

export function OrdersManagement({ orders }: OrdersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredOrders = orders.filter((order) => {
    const customerName = order.profiles?.full_name || order.profiles?.email || ""
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return CheckCircle
      case "shipped":
        return Truck
      case "processing":
        return Package
      case "cancelled":
        return XCircle
      default:
        return Package
    }
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and track fulfillment</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Total Orders", value: orderStats.total, color: "text-blue-600" },
          { label: "Pending", value: orderStats.pending, color: "text-orange-600" },
          { label: "Processing", value: orderStats.processing, color: "text-yellow-600" },
          { label: "Shipped", value: orderStats.shipped, color: "text-blue-600" },
          { label: "Delivered", value: orderStats.delivered, color: "text-green-600" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders by customer or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus("all")}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("processing")}>Processing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("shipped")}>Shipped</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("delivered")}>Delivered</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("cancelled")}>Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group hover:bg-muted/20"
                    >
                      <TableCell>
                        <p className="font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.profiles?.full_name || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{order.profiles?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {order.order_items?.slice(0, 3).map((item, i) => (
                            <div key={i} className="w-8 h-8 rounded overflow-hidden bg-muted/20">
                              <img
                                src={item.product?.images?.[0] || "/placeholder.svg?height=32&width=32"}
                                alt={item.product?.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {(order.order_items?.length || 0) > 3 && (
                            <span className="text-sm text-muted-foreground">
                              +{(order.order_items?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="w-4 h-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
