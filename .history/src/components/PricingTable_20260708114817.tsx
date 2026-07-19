"use client";

import type { ProductPricingTier } from "@/data/products";

interface PricingTableProps {
  pricing: ProductPricingTier[];
}

export default function PricingTable({ pricing }: PricingTableProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
      <div className="border-b border-white/10 px-5 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent-custom">
        Quantity Pricing
      </div>
      <div className="divide-y divide-white/10">
        {pricing.map((tier) => (
          <div key={`${tier.min}-${tier.max ?? "max"}`} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent-custom/10">
            <span className="text-sm text-foreground">
              {tier.max ? `${tier.min}–${tier.max} Pieces` : `${tier.min}+ Pieces`}
            </span>
            <span className="text-sm font-semibold text-accent-custom">₹{tier.price} / Piece</span>
          </div>
        ))}
      </div>
    </div>
  );
}
