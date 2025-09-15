import { createClient } from "@/lib/supabase/server"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  // Get date range (last 30 days)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  // Fetch analytics data
  const [{ data: events }, { data: topProducts }, { data: userActivity }, { data: revenueData }] = await Promise.all([
    // All events in date range
    supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: false }),

    // Top viewed products
    supabase
      .from("analytics_events")
      .select(`
        product_id,
        products(name, images, price)
      `)
      .eq("event_type", "product_view")
      .not("product_id", "is", null)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString()),

    // User activity
    supabase
      .from("analytics_events")
      .select("user_id, event_type, created_at")
      .not("user_id", "is", null)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString()),

    // Revenue data from orders
    supabase
      .from("orders")
      .select("total_amount, created_at, status")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString()),
  ])

  const analyticsData = {
    events: events || [],
    topProducts: topProducts || [],
    userActivity: userActivity || [],
    revenueData: revenueData || [],
    dateRange: { startDate, endDate },
  }

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <AnalyticsDashboard data={analyticsData} />
      </AdminLayout>
    </AuthGuard>
  )
}
