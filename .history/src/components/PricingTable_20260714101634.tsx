"use client";

import type { ProductPricingTier } from "@/data/products";

interface PricingTableProps {
  pricing: ProductPricingTier[];
}

export default function PricingTable({ pricing }: PricingTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-[0_28px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="border-b border-white/10 px-6 py-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
        Quantity Pricing
      </div>
      <div className="divide-y divide-white/10">
        {pricing.map((tier) => (
          <div key={`${tier.min}-${tier.max ?? "max"}`} className="flex items-center justify-between px-6 py-4 transition duration-200 hover:bg-white/10">
            <span className="text-sm text-foreground/90">
              {tier.max ? `${tier.min}–${tier.max} Pieces` : `${tier.min}+ Pieces`}
            </span>
            <span className="text-sm font-semibold text-[#d4af37]">₹{tier.price} / Piece</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-xs leading-5 text-foreground/80">
        ₹20 / unit additional charge applies for 3XL sizes on all products.
      </div>
    </div>
  );
}
