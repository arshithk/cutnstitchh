import { CheckCircle2, Clock3, Sparkles } from "lucide-react";
import type { ProductDetail, ProductVariant } from "@/data/products";

interface ProductInfoProps {
  product: ProductDetail;
  variants?: ProductVariant[];
  activeVariant?: ProductVariant | null;
  showVariantCards?: boolean;
}

export default function ProductInfo({ product, variants = [], activeVariant, showVariantCards = false }: ProductInfoProps) {
  const shouldShowVariantCards = showVariantCards && variants.length > 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-accent-custom/30 bg-accent-custom/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent-custom">
          {product.category}
        </span>
        {product.premiumQuality ? (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Premium Quality
          </span>
        ) : null}
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
      <p className="mt-3 text-lg text-muted-custom">{product.tagline}</p>
      <p className="mt-4 text-base leading-7 text-foreground/90">{product.description}</p>

      {shouldShowVariantCards ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {variants.map((variant) => {
              const isActive = activeVariant?.id === variant.id;
              return (
                <div
                  key={variant.id}
                  className={`rounded-3xl border p-5 shadow-[0_20px_70px_rgba(0,0,0,0.16)] transition-colors duration-200 ${isActive ? "border-accent-custom/40 bg-accent-custom/10" : "border-white/10 bg-white/5"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">{variant.name}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent-custom">{variant.gsmRange}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-base font-semibold text-foreground">{variant.fabric}</p>
                    <p className="mt-3 text-sm leading-6 text-muted-custom">{variant.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">Sizes</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{product.sizes.join(", ")}</p>
          </div>
        </>
      ) : (
        <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">MOQ</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{product.moq}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">Fabric</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{product.fabric}</p>
          </div>
          {!product.inquiryOnly ? (
            <>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">GSM</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{product.gsmRange}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">Sizes</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{product.sizes.join(", ")}</p>
              </div>
            </>
          ) : null}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-muted-custom">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">Description</p>
        <p className="mt-2 text-base leading-7 text-foreground/90">{product.description}</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-accent-custom/20 bg-accent-custom/10 px-4 py-3 text-sm text-accent-custom">
          <CheckCircle2 className="h-5 w-5" />
          Available for Bulk Manufacturing
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-custom">
          <Clock3 className="h-5 w-5 text-accent-custom" />
          Premium dispatch workflow for repeat and seasonal B2B orders
        </div>
      </div>

    </>
  );
}
