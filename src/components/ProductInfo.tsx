import type { ProductDetail, ProductVariant } from "@/data/products";
import FeatureCards from "@/components/FeatureCards";

interface ProductInfoProps {
  product: ProductDetail;
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
}

export default function ProductInfo({ product, selectedVariant, onVariantSelect }: ProductInfoProps) {
  const fabricOptions: ProductVariant[] = product.variants?.length
    ? product.variants
    : [
        {
          id: "default-fabric",
          name: product.fabric,
          fabric: product.fabric,
          gsmRange: product.gsmRange ?? "",
          description: product.description ?? "",
          heroImage: product.heroImage,
          thumbnailImage: product.heroImage,
          colors: product.colors,
          sizes: product.sizes,
          moq: product.moq,
        },
      ];

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

      {/* Quick details pills */}
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/80">
          <span className="font-semibold text-accent-custom">GSM</span>&nbsp;{product.gsmRange}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/80">
          <span className="font-semibold text-accent-custom">MOQ</span>&nbsp;{product.moq}
        </span>
        {product.sizes.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/80">
            <span className="font-semibold text-accent-custom">Sizes</span>&nbsp;{product.sizes.join(", ")}
          </span>
        )}
      </div>

      {/* Specs sections — shown for Corporate Wear, Uniforms, etc. */}
      {product.specs && product.specs.length > 0 && (
        <div className="mt-8 space-y-4">
          {product.specs.map((section) => (
            <div
              key={section.heading}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-custom">
                {section.heading}
              </p>

              {/* Colour dots */}
              {section.colors && section.colors.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {section.colors.map((color) => (
                    <div key={color.name} className="group relative flex items-center gap-1.5">
                      <span
                        className="block h-6 w-6 rounded-full border-2 border-white/20 shadow-sm ring-1 ring-black/20 transition-transform duration-150 group-hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Text item pills */}
              {section.items && section.items.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground/90"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Available Fabrics — only shown when no specs override */}
      {!product.specs && (
        <section className="mt-8 rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground">Available Fabrics</h2>
            <p className="text-sm leading-6 text-muted-custom">Click a fabric to preview its colours and pricing.</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fabricOptions.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onVariantSelect(variant)}
                  className={`flex h-full flex-col rounded-3xl border p-6 text-left transition duration-300 ${
                    isSelected
                      ? "border-accent-custom bg-accent-custom/10 shadow-[0_0_0_1px_rgba(212,175,55,0.24),0_14px_35px_rgba(212,175,55,0.08)]"
                      : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-custom">{variant.gsmRange || "Standard GSM"}</p>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{variant.fabric}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-custom">{variant.description}</p>
                  {isSelected && (
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent-custom">
                      ✓ Selected
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex h-full flex-col justify-between rounded-4xl border border-white/10 bg-black/35 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">Sizes</p>
          <p className="mt-3 text-lg font-semibold text-foreground">
            {(selectedVariant?.sizes ?? product.sizes).join(", ") || "Custom / On Request"}
          </p>
        </div>
        <div className="flex h-full flex-col justify-between rounded-4xl border border-white/10 bg-black/35 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">MOQ</p>
          <p className="mt-3 text-lg font-semibold text-foreground">{selectedVariant?.moq ?? product.moq}</p>
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
