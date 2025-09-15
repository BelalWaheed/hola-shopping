import { createClient } from "@/lib/supabase/client"

export interface AnalyticsEvent {
  event_type: string
  user_id?: string
  product_id?: string
  session_id?: string
  metadata?: Record<string, any>
}

class Analytics {
  private supabase = createClient()
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async track(event: AnalyticsEvent) {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      await this.supabase.from("analytics_events").insert({
        event_type: event.event_type,
        user_id: user?.id || null,
        product_id: event.product_id || null,
        session_id: event.session_id || this.sessionId,
        metadata: event.metadata || {},
      })
    } catch (error) {
      console.error("Analytics tracking error:", error)
    }
  }

  // Convenience methods for common events
  async trackPageView(page: string, metadata?: Record<string, any>) {
    await this.track({
      event_type: "page_view",
      metadata: { page, ...metadata },
    })
  }

  async trackProductView(productId: string, metadata?: Record<string, any>) {
    await this.track({
      event_type: "product_view",
      product_id: productId,
      metadata,
    })
  }

  async trackAddToCart(productId: string, quantity: number, metadata?: Record<string, any>) {
    await this.track({
      event_type: "add_to_cart",
      product_id: productId,
      metadata: { quantity, ...metadata },
    })
  }

  async trackRemoveFromCart(productId: string, metadata?: Record<string, any>) {
    await this.track({
      event_type: "remove_from_cart",
      product_id: productId,
      metadata,
    })
  }

  async trackPurchase(orderId: string, totalAmount: number, items: any[], metadata?: Record<string, any>) {
    await this.track({
      event_type: "purchase",
      metadata: {
        order_id: orderId,
        total_amount: totalAmount,
        items,
        ...metadata,
      },
    })
  }

  async trackSearch(query: string, resultsCount: number, metadata?: Record<string, any>) {
    await this.track({
      event_type: "search",
      metadata: {
        query,
        results_count: resultsCount,
        ...metadata,
      },
    })
  }

  async trackUserSignup(metadata?: Record<string, any>) {
    await this.track({
      event_type: "user_signup",
      metadata,
    })
  }

  async trackUserLogin(metadata?: Record<string, any>) {
    await this.track({
      event_type: "user_login",
      metadata,
    })
  }
}

export const analytics = new Analytics()
