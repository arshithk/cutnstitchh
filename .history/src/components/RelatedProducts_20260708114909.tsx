"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";

interface RelatedProductsProps {
  slugs: string[];
}

export default function RelatedProducts({ slugs }: RelatedProductsProps) {
  const related = products.filter((product) => slugs.includes(product.slug));

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-custom">Discover more</p>
          <h2 className="text-2xl font-semibold text-foreground">You May Also Like</h2>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {related.map((product) => (
          <Link key={product.slug} href={`/products/${product.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35 transition hover:-translate-y-1 hover:border-accent-custom/40">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={product.heroImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-foreground">{product.name}</p>
              <p className="mt-1 text-sm text-muted-custom">{product.fabric}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-accent-custom">
                Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
