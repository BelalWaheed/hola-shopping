"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Zap, Eye, Heart, ShoppingBag } from "lucide-react"

export function ProductDiscovery() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Discover products instantly with our advanced search and filtering system.",
    },
    {
      icon: Eye,
      title: "Visual Discovery",
      description: "Explore products through our innovative visual browsing experience.",
    },
    {
      icon: Heart,
      title: "Personalized",
      description: "Get recommendations tailored to your preferences and shopping history.",
    },
    {
      icon: ShoppingBag,
      title: "Seamless Shopping",
      description: "Enjoy a smooth shopping experience from discovery to checkout.",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Future of Product Discovery</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience shopping like never before with our innovative features designed to make product discovery
            effortless and enjoyable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6"
          >
            Start Exploring
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
