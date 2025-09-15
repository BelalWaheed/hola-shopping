"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Users, TrendingUp, TrendingDown, Activity, Target } from "lucide-react"
import type { AnalyticsEvent, Product } from "@/lib/types"

interface AnalyticsData {
  events: AnalyticsEvent[]
  topProducts: (AnalyticsEvent & { products?: Pick<Product, "name" | "images" | "price"> })[]
  userActivity: AnalyticsEvent[]
  revenueData: { total_amount: number; created_at: string; status: string }[]
  dateRange: { startDate: Date; endDate: Date }
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { events, topProducts, userActivity, revenueData, dateRange } = data

  // Process data for charts
  const processedData = useMemo(() => {
    // Daily page views
    const dailyViews = events
      .filter((e) => e.event_type === "page_view")
      .reduce(
        (acc, event) => {
          const date = new Date(event.created_at).toLocaleDateString()
          acc[date] = (acc[date] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    const dailyViewsChart = Object.entries(dailyViews).map(([date, views]) => ({
      date,
      views,
    }))

    // Event type distribution
    const eventTypes = events.reduce(
      (acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const eventTypesChart = Object.entries(eventTypes).map(([type, count]) => ({
      type: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      count,
      percentage: Math.round((count / events.length) * 100),
    }))

    // Top products by views
    const productViews = topProducts.reduce(
      (acc, event) => {
        if (event.product_id && event.products) {
          const key = event.product_id
          if (!acc[key]) {
            acc[key] = {
              id: event.product_id,
              name: event.products.name,
              image: event.products.images?.[0],
              price: event.products.price,
              views: 0,
            }
          }
          acc[key].views += 1
        }
        return acc
      },
      {} as Record<string, any>,
    )

    const topProductsChart = Object.values(productViews)
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 10)

    // Daily revenue
    const dailyRevenue = revenueData
      .filter((order) => order.status === "paid" || order.status === "delivered")
      .reduce(
        (acc, order) => {
          const date = new Date(order.created_at).toLocaleDateString()
          acc[date] = (acc[date] || 0) + order.total_amount
          return acc
        },
        {} as Record<string, number>,
      )

    const dailyRevenueChart = Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }))

    // User engagement metrics
    const uniqueUsers = new Set(userActivity.map((e) => e.user_id)).size
    const totalSessions = new Set(events.map((e) => e.session_id)).size
    const avgSessionLength = events.length / totalSessions

    return {
      dailyViewsChart,
      eventTypesChart,
      topProductsChart,
      dailyRevenueChart,
      uniqueUsers,
      totalSessions,
      avgSessionLength,
    }
  }, [events, topProducts, userActivity, revenueData])

  const stats = [
    {
      title: "Total Events",
      value: events.length.toLocaleString(),
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Unique Users",
      value: processedData.uniqueUsers.toLocaleString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      change: "+8%",
      trend: "up",
    },
    {
      title: "Total Sessions",
      value: processedData.totalSessions.toLocaleString(),
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      change: "+15%",
      trend: "up",
    },
    {
      title: "Avg Session Events",
      value: Math.round(processedData.avgSessionLength).toString(),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      change: "-3%",
      trend: "down",
    },
  ]

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Insights and metrics for the last 30 days ({dateRange.startDate.toLocaleDateString()} -{" "}
          {dateRange.endDate.toLocaleDateString()})
        </p>
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
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                    </div>
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
        {/* Daily Page Views */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Daily Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={processedData.dailyViewsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Event Types Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processedData.eventTypesChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {processedData.eventTypesChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Viewed Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processedData.topProductsChart.slice(0, 5).map((product: any, index) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0">
                      <img
                        src={product.image || "/placeholder.svg?height=48&width=48"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">${product.price?.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{product.views} views</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processedData.dailyRevenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.slice(0, 20).map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">
                        {event.event_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <span>
                            {Object.entries(event.metadata)
                              .slice(0, 2)
                              .map(([key, value]) => (
                                <span key={key}>
                                  {key}: {String(value)}{" "}
                                </span>
                              ))}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{new Date(event.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
