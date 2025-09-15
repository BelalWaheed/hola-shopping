import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductsPageContent } from "@/components/products/products-page-content"

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Fetch categories for filters
  const { data: categories } = await supabase.from("categories").select("*")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">All Products</h1>
            <p className="text-muted-foreground text-lg">Discover our complete collection of premium products</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters categories={categories || []} />
            </aside>
            <div className="flex-1">
              <ProductGrid products={products || []} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ProductsPageContent productsCount={products?.length || 0} categoriesCount={categories?.length || 0} />
    </div>
  )
}
