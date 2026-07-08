"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { products } from "@/data/products";
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
          {products.map((product, idx) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border-custom/60 bg-card/80 shadow-[0_20px_50px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-custom/50 hover:shadow-[0_30px_70px_rgba(0,0,0,0.22)]"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <Image src={product.heroImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                  <span className="rounded-full border border-accent-custom/20 bg-accent-custom/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-custom">
                    {product.category}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-custom">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border-custom/70 px-2.5 py-1 text-xs text-muted-custom">MOQ {product.moq}</span>
                  <span className="rounded-full border border-border-custom/70 px-2.5 py-1 text-xs text-muted-custom">{product.fabric}</span>
                </div>

                <Link href={`/products/${product.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-custom px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110">
                  View Product
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
