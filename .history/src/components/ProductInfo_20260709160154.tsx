import { CheckCircle2 } from "lucide-react";
import type { ProductDetail, ProductVariant } from "@/data/products";
import FeatureCards from "@/components/FeatureCards";

interface ProductInfoProps {
  product: ProductDetail;
  variants?: ProductVariant[];
  showVariantCards?: boolean;
}

export default function ProductInfo({ product, variants = [], showVariantCards = false }: ProductInfoProps) {
  const fabricOptions = variants.length > 0
    ? variants
    : [
        {
          id: "default-fabric",
          name: product.fabric,
          fabric: product.fabric,
          gsmRange: product.gsmRange ?? "",
          description: product.description ?? "",
        },
      ] as ProductVariant[];

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
      <p className="mt-6 text-base leading-7 text-foreground/90">{product.description}</p>

      <section className="mt-10 rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Available Fabrics</h2>
          <p className="text-sm leading-6 text-muted-custom">Browse premium textile options with consistent GSM, composition, and tailored performance.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {fabricOptions.map((variant) => {
            const isActive = activeVariant?.id === variant.id;
            const cardClasses = `relative flex h-full flex-col rounded-3xl border bg-white/5 p-5 text-left shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition-all duration-300 ${isActive ? "border-[#d4af37] shadow-[0_0_0_15px_rgba(212,175,55,0.12)]" : "border-white/10 hover:border-white/20 hover:shadow-[0_24px_70px_rgba(0,0,0,0.14)]"}`;

            const cardContent = (
              <div className={cardClasses}>
                {isActive ? (
                  <div className="absolute right-4 top-4 text-[#d4af37] opacity-90">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">{variant.gsmRange || "Standard GSM"}</p>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{variant.fabric}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-custom">{variant.description}</p>
                  </div>
                </div>
              </div>
            );

            return onVariantSelect && variant.id ? (
              <button
                key={variant.id}
                type="button"
                onClick={() => onVariantSelect(variant.id)}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {cardContent}
              </button>
            ) : (
              <div key={variant.id}>{cardContent}</div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">Sizes</p>
          <p className="mt-3 text-lg font-semibold text-foreground">{product.sizes.join(", ")}</p>
        </div>

        <div className="rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">MOQ</p>
          <p className="mt-3 text-lg font-semibold text-foreground">{product.moq}</p>
          <p className="mt-3 text-sm leading-6 text-muted-custom">Optimized for premium bulk production with consistent lead times.</p>
        </div>
      </section>

      <section className="mt-8 rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Feature Highlights</h2>
          <p className="text-sm leading-6 text-muted-custom">Key production benefits for premium wholesale apparel.</p>
        </div>
        <div className="mt-6">
          <FeatureCards features={product.features} />
        </div>
      </section>
    </>
  );
}
