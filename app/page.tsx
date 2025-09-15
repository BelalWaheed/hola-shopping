import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { ProductDiscovery } from "@/components/home/product-discovery"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HomePageContent } from "@/components/home/home-page-content"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("status", "active")
    .eq("featured", true)
    .limit(6)

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").limit(5)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts products={featuredProducts || []} />
        <CategoryShowcase categories={categories || []} />
        <ProductDiscovery />
        <HomePageContent featuredProducts={featuredProducts || []} categories={categories || []} />
      </main>
      <Footer />
    </div>
  )
}
