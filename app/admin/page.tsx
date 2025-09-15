import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardOverview } from "@/components/admin/dashboard-overview"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  // Fetch dashboard data
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalUsers },
    { data: recentOrders },
    { data: topProducts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select(`
        *,
        profiles(full_name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("products").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(5),
  ])

  const dashboardData = {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalUsers: totalUsers || 0,
    recentOrders: recentOrders || [],
    topProducts: topProducts || [],
  }

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <DashboardOverview data={dashboardData} />
      </AdminLayout>
    </AuthGuard>
  )
}
