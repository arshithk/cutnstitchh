import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductDetail } from "@/data/products";

interface ProductCardProps {
  product: ProductDetail;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border-custom/60 bg-card/80 shadow-[0_20px_50px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-custom/50 hover:shadow-[0_30px_70px_rgba(0,0,0,0.22)]">
      <div className="relative aspect-4/5 overflow-hidden">
        <Image
          src={product.heroImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
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
    </article>
  );
}
