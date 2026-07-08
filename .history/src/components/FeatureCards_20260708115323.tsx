"use client";

import type { ComponentType } from "react";
import { BadgeCheck, Factory, MapPinned, ShieldCheck, Snowflake, Sparkles, Sprout, Truck } from "lucide-react";
import type { ProductFeature } from "@/data/products";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Sprout,
  ShieldCheck,
  Factory,
  Truck,
  BadgeCheck,
  MapPinned,
  Snowflake,
  Sparkles,
};

interface FeatureCardsProps {
  features: ProductFeature[];
}

export default function FeatureCards({ features }: FeatureCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {features.map((feature) => {
        const Icon = iconMap[feature.icon] ?? ShieldCheck;

        return (
          <div key={feature.title} className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-custom/15 text-accent-custom">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-custom">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
