import { createClient } from "@/lib/supabase/server"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { OrdersManagement } from "@/components/admin/orders-management"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  // Fetch orders with user profiles
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles(full_name, email),
      order_items(
        *,
        product:products(name, images)
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <OrdersManagement orders={orders || []} />
      </AdminLayout>
    </AuthGuard>
  )
}
