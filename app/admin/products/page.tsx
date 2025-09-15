import { createClient } from "@/lib/supabase/server"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductsManagement } from "@/components/admin/products-management"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // Fetch products with categories
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <ProductsManagement products={products || []} categories={categories || []} />
      </AdminLayout>
    </AuthGuard>
  )
}
