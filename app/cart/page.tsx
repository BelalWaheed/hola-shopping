import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartPageContent } from "@/components/cart/cart-page-content"

export default async function CartPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch cart items
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
      *,
      product:products(
        *,
        category:categories(*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <CartPageContent initialCartItems={cartItems || []} />
      </main>
      <Footer />
    </div>
  )
}
