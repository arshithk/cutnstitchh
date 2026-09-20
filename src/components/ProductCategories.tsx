"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { catalogCategories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const HOME_PRODUCT_PILLS = [
  { name: "Regular Fit", href: "/products/regular-fit" },
  { name: "Polo", href: "/products/polo" },
  { name: "Oversized", href: "/products/oversized" },
  { name: "Hoodies", href: "/products/hoodie" },
  { name: "Sweatshirts", href: "/products/sweatshirt" },
  { name: "Shorts", href: "/products/shorts" },
  { name: "Joggers", href: "/products/joggers" },
];

export default function ProductCategories() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const catalogCategorySlugs = new Set(catalogCategories.map((category) => category.slug));
  const legacyProducts = products.filter(
    (product) =>
      !["regular-fit-t-shirts", "polo-t-shirts", "oversized-t-shirts"].includes(product.slug) &&
      !catalogCategorySlugs.has(product.slug),
  );
  const catalogCards = [
    ...catalogCategories.map((category) => ({ type: "category" as const, item: category })),
    ...legacyProducts.map((product) => ({ type: "product" as const, item: product })),
  ];

  return (
    <section id="products" className="scroll-mt-20 relative overflow-hidden bg-background py-8 sm:py-10 lg:py-12" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 flex max-w-2xl flex-col gap-3 text-center sm:mb-8 lg:mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">Our Catalog</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">Premium Product Categories.</h2>
          <p className="text-base leading-relaxed text-muted-custom">
            Explore our manufacturing-ready catalog with premium detail pages, bulk pricing, and a refined B2B experience.
          </p>

          {/* Quick Product Category Navigation Pills */}
          <div className="mt-3 flex justify-center overflow-x-auto hide-scrollbar">
            <div className="inline-flex items-center gap-1 rounded-full border border-border-custom/80 bg-card/80 p-1.5 shadow-sm backdrop-blur-md">
              {HOME_PRODUCT_PILLS.map((pill) => (
                <Link
                  key={pill.name}
                  href={pill.href}
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-custom transition-all hover:bg-foreground hover:text-background hover:shadow-sm whitespace-nowrap"
                >
                  {pill.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catalogCards.map((card, idx) => (
            <motion.div
              key={`${card.type}-${card.item.slug}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
            >
              {card.type === "category" ? (
                <ProductCard category={card.item} />
              ) : (
                <ProductCard product={card.item} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
