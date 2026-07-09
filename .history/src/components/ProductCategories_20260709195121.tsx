"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { catalogCategories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProductCategories() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <section id="products" className="scroll-mt-20 relative overflow-hidden bg-background py-8 sm:py-10 lg:py-12" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 flex max-w-2xl flex-col gap-3 text-center sm:mb-8 lg:mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">Our Catalog</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">Premium Product Categories.</h2>
          <p className="text-base leading-relaxed text-muted-custom">
            Explore our manufacturing-ready catalog with premium detail pages, bulk pricing, and a refined B2B experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catalogCategories.map((category, idx) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
            >
              <ProductCard category={category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
