import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VariantCard from "@/components/VariantCard";
import type { CatalogCategory } from "@/data/products";

interface VariantListingProps {
  category: CatalogCategory;
}

export default function VariantListing({ category }: VariantListingProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-custom transition hover:opacity-80">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{category.name}</h1>
          <p className="mt-3 text-base leading-7 text-muted-custom">{category.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {category.variants.map((variant, index) => (
          <VariantCard
            key={variant.slug}
            categorySlug={category.slug}
            variant={variant}
            variantIndex={index}
          />
        ))}
      </div>
    </div>
  );
}
