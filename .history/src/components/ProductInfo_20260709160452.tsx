import type { ProductDetail, ProductVariant } from "@/data/products";
import FeatureCards from "@/components/FeatureCards";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
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

      <section className="mt-8 rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Available Fabrics</h2>
          <p className="text-sm leading-6 text-muted-custom">Premium fabric and GSM specifications for your selected t-shirt collection.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {fabricOptions.map((variant) => (
            <div
              key={variant.id}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 text-left transition duration-200 hover:border-white/20 hover:bg-white/10"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-custom">{variant.gsmRange || "Standard GSM"}</p>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{variant.fabric}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-custom">{variant.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex h-full flex-col justify-between rounded-4xl border border-white/10 bg-black/35 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">Sizes</p>
          <p className="mt-3 text-lg font-semibold text-foreground">{product.sizes.join(", ")}</p>
        </div>

        <div className="flex h-full flex-col justify-between rounded-4xl border border-white/10 bg-black/35 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">MOQ</p>
          <p className="mt-3 text-lg font-semibold text-foreground">{product.moq}</p>
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
