"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shirt, Sparkles } from "lucide-react";
import type { CatalogVariant } from "@/data/products";
import { normalizeImageSrc } from "@/lib/image";

interface VariantDetailsProps {
  categoryName: string;
  variant: CatalogVariant;
}

export default function VariantDetails({ categoryName, variant }: VariantDetailsProps) {
  const detailItems = [
    { label: "MOQ", value: variant.moq },
    { label: "Fabric", value: variant.fabric },
    { label: "GSM", value: variant.gsm },
    { label: "Fit", value: variant.fit },
    { label: "Sizes", value: variant.sizes.join(", ") },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href={`/products/${variant.categorySlug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-accent-custom transition hover:opacity-80">
            <ArrowLeft size={16} />
            Back to Variants
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{variant.name}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-custom">{variant.description}</p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-accent-custom/20 bg-accent-custom/10 px-4 py-2 text-sm font-semibold text-accent-custom">
          <Shirt size={16} />
          {categoryName}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-4xl border border-border-custom/70 bg-card/70 shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
          <div className="relative aspect-4/3">
            <Image
              src={normalizeImageSrc(variant.heroImage)}
              alt={variant.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="rounded-4xl border border-border-custom/70 bg-card/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-accent-custom/20 bg-accent-custom/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent-custom">
              {variant.gsm}
            </span>
            <span className="rounded-full border border-border-custom/70 px-3 py-1 text-xs font-medium text-muted-custom">
              {variant.fabric}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {detailItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border-custom/60 bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-custom">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border-custom/60 bg-background/80 p-5">
            <div className="flex items-center gap-2 text-accent-custom">
              <Sparkles size={16} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em]">Available Colours</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {variant.colors.map((color) => (
                <div key={color.name} className="flex items-center gap-2 rounded-full border border-border-custom/70 px-3 py-2 text-sm text-foreground">
                  <span className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">Printing Compatibility</h2>
              <p className="mt-2 text-sm leading-7 text-muted-custom">{variant.printingCompatibility}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">Embroidery Compatibility</h2>
              <p className="mt-2 text-sm leading-7 text-muted-custom">{variant.embroideryCompatibility ?? "Embroidery compatibility is available on request for this fabric and finish."}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">Product Description</h2>
              <p className="mt-2 text-sm leading-7 text-muted-custom">{variant.productDescription}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-full bg-accent-custom px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110">
              Get Quote
            </button>
            <Link href={`/products/${variant.categorySlug}`} className="rounded-full border border-border-custom/70 px-5 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-foreground/5">
              Back to Variants
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
