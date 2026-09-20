import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ProductVariant } from "@/models/Product";
import VariantCard from "@/components/VariantCard";

const CATEGORY_TABS = [
  { name: "Regular Fit", slug: "regular-fit", href: "/products/regular-fit" },
  { name: "Polo", slug: "polo", href: "/products/polo" },
  { name: "Oversized", slug: "oversized", href: "/products/oversized" },
  { name: "Hoodies", slug: "hoodie", href: "/products/hoodie" },
  { name: "Sweatshirts", slug: "sweatshirt", href: "/products/sweatshirt" },
  { name: "Shorts", slug: "shorts", href: "/products/shorts" },
  { name: "Joggers", slug: "joggers", href: "/products/joggers" },
];

interface VariantListingProps {
  category: {
    name: string;
    slug: string;
    description?: string;
    variants: ProductVariant[];
  };
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

      {/* Middle Category Switcher Bar */}
      <div className="flex w-full items-center justify-start sm:justify-center overflow-x-auto hide-scrollbar -mt-2">
        <div className="inline-flex items-center gap-1 rounded-full border border-border-custom/80 bg-card/90 p-1.5 shadow-md backdrop-blur-md">
          {CATEGORY_TABS.map((tab) => {
            const isCurrent =
              category.slug === tab.slug ||
              (tab.slug === "regular-fit" && category.slug.includes("regular-fit")) ||
              (tab.slug === "polo" && category.slug.includes("polo")) ||
              (tab.slug === "oversized" && category.slug.includes("oversized"));
            return (
              <Link
                key={tab.slug}
                href={tab.href}
                className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all whitespace-nowrap ${
                  isCurrent
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-custom hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {category.variants.map((variant, index) => (
          <VariantCard
            key={`${category.slug}-${variant.slug || (variant as any).id || index}-${index}`}
            categorySlug={category.slug}
            variant={variant}
            variantIndex={index}
          />
        ))}
      </div>
    </div>
  );
}
