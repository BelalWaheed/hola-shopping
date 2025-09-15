"use client"

import { motion } from "framer-motion"
import type { Category } from "@/lib/types"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface CategoryShowcaseProps {
  categories: Category[]
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our diverse range of categories, each curated with the finest products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 p-8 h-64 flex flex-col justify-between border border-border/50 hover:border-primary/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{category.description}</p>
                  </div>

                  <div className="relative z-10 flex items-center text-primary group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
