import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogVariant } from "@/data/products";
import { normalizeImageSrc } from "@/lib/image";
import { getProductImagePath } from "@/lib/productImageMap";

interface VariantCardProps {
  categorySlug: string;
  variant: CatalogVariant;
  variantIndex: number;
}

function selectVariantDisplayColor(colors: CatalogVariant["colors"], variantIndex: number) {
  const nonWhiteColors = colors.filter(
    (color) => color.name.toLowerCase() !== "white" && color.name.toLowerCase() !== "off-white",
  );
  const candidateColors = nonWhiteColors.length > 0 ? nonWhiteColors : colors;
  return candidateColors[variantIndex % candidateColors.length] ?? colors[0];
}

export default function VariantCard({ categorySlug, variant, variantIndex }: VariantCardProps) {
  const displayColor = selectVariantDisplayColor(variant.colors, variantIndex);
  const previewImage = getProductImagePath(
    {
      categorySlug,
      variantName: variant.name,
      variantSlug: variant.slug,
      fabric: variant.fabric,
      gsmRange: variant.gsm,
    },
    displayColor?.name ?? "White",
    variant.thumbnailImage ?? variant.heroImage,
  );

  const displayFabric = variant.fabric
    .replace(/100% Cotton S-Jersey/gi, "Elite Cotton")
    .replace(/100% Cotton Piqu[é|e]/gi, "Elite Cotton")
    .replace(/Premium Cotton Piqu[é|e]/gi, "Premium Cotton (Bio Washed)");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border-custom/70 bg-card/70 shadow-[0_16px_45px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-custom/40 hover:shadow-[0_28px_70px_rgba(0,0,0,0.22)]">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={normalizeImageSrc(previewImage)}
          alt={variant.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
          className="object-cover object-center transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{variant.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-custom">{variant.description}</p>
          </div>
          <span className="rounded-full border border-accent-custom/20 bg-accent-custom/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-custom">
            {variant.gsm}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-border-custom/70 px-2.5 py-1 text-xs text-muted-custom">{displayFabric}</span>
          <span className="rounded-full border border-border-custom/70 px-2.5 py-1 text-xs text-muted-custom">{variant.fit}</span>
        </div>

        <Link
          href={`/products/${categorySlug}/${variant.slug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-custom px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110"
        >
          View Details
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
