"use client";

import React, { createContext, useContext, useState } from "react";

export interface HeroProductModel {
  id: string;
  slug: string;
  name: string;
  navLabel: string;
  badge: string;
  headline: string;
  subheadline: string;
  description: string;
  image: string;
  tagline: string;
  href: string;
  accentColor: string;
  features: string[];
}

export const HERO_PRODUCT_MODELS: HeroProductModel[] = [
  {
    id: "regular-fit",
    slug: "regular-fit",
    name: "Regular Fit T-Shirt",
    navLabel: "Regular Fit",
    badge: "100% Bio-Washed Combed Cotton",
    headline: "Stand Out Without Trying.",
    subheadline: "Everyday essentials crafted with perfection.",
    description:
      "Retail-grade 180 GSM combed cotton tailored for comfort, structure, and high-impact custom branding. Engineered for modern apparel programs.",
    image: "/images/cotton-regular-fit-tshirt-black.jpeg",
    tagline: "Retail Grade • 180 GSM Bio-Washed Cotton",
    href: "/products/regular-fit",
    accentColor: "#d4af37",
    features: ["180 GSM", "Bio-Washed", "Low MOQ 100", "Custom Labels"],
  },
  {
    id: "polo",
    slug: "polo",
    name: "Polo T-Shirts",
    navLabel: "Polo",
    badge: "Classic Pique Knit & Matty",
    headline: "Refined Collars, Retail Polish.",
    subheadline: "The gold standard for corporate & lifestyle.",
    description:
      "Premium 220-240 GSM Pique and Combed Cotton Polos with crisp collars, tipping details, and enduring durability for executive merchandising.",
    image: "/images/cotton-polo-black.jpeg",
    tagline: "Structured Knit • Premium Collar Finish",
    href: "/products/polo",
    accentColor: "#d4af37",
    features: ["220-240 GSM", "Pique Knit", "Embroidery Ready", "PAN India"],
  },
  {
    id: "oversized",
    slug: "oversized",
    name: "Oversized T-Shirts",
    navLabel: "Oversized",
    badge: "Heavyweight Streetwear Silhouette",
    headline: "Made Loud, On Purpose.",
    subheadline: "Drop-shoulder aesthetic with heavy drape.",
    description:
      "Heavyweight 220-240 GSM French Terry and dense single jersey with a drop-shoulder cut, boxy drape, and street-ready retail appeal.",
    image: "/images/oversized-frenchterry-black.png",
    tagline: "Drop Shoulder • Heavyweight 240 GSM",
    href: "/products/oversized",
    accentColor: "#d4af37",
    features: ["240 GSM Terry", "Drop Shoulder", "High Density Print", "Zero Shrinkage"],
  },
  {
    id: "hoodie",
    slug: "hoodie",
    name: "Hoodies",
    navLabel: "Hoodies",
    badge: "300-360 GSM Fleece & Loopknit",
    headline: "Warmth Meets Luxury Structure.",
    subheadline: "Heavyweight hoodies built to endure.",
    description:
      "Ultra-soft brushed fleece interior, double-layered hood, and reinforced kangaroo pockets. The definitive luxury hoodie base for streetwear collections.",
    image: "/images/hoodie-without-zip-black.png",
    tagline: "Brushed Fleece • Double-Layered Hood",
    href: "/products/hoodie",
    accentColor: "#d4af37",
    features: ["300-360 GSM", "Double Layer Hood", "YKK Zippers", "Custom Drawstrings"],
  },
  {
    id: "sweatshirt",
    slug: "sweatshirt",
    name: "Sweatshirts",
    navLabel: "Sweatshirts",
    badge: "French Terry & Fleece",
    headline: "Minimalist Form, Supreme Comfort.",
    subheadline: "Clean crewnecks for modern brands.",
    description:
      "Tailored crewneck sweatshirts with ribbed trims, smooth surface for high-resolution DTF and embroidery, and cozy all-day warmth.",
    image: "/images/sweatshirt-cotton-fleece-black.png",
    tagline: "Loopknit Interior • Ribbed Trims",
    href: "/products/sweatshirt",
    accentColor: "#d4af37",
    features: ["280-300 GSM", "Ribbed Collar & Cuffs", "Screen Print Friendly", "Export Grade"],
  },
  {
    id: "shorts",
    slug: "shorts",
    name: "Shorts",
    navLabel: "Shorts",
    badge: "Athletic & Lifestyle French Terry",
    headline: "Unrestricted Movement & Flow.",
    subheadline: "Engineered for active lifestyles and loungewear.",
    description:
      "Breathable French Terry and 4-way stretch Lycra shorts with elasticated waistband, custom drawstrings, and deep secure pockets.",
    image: "/images/shorts-navy-blue.jpeg",
    tagline: "French Terry • Elastic Waistband",
    href: "/products/shorts",
    accentColor: "#d4af37",
    features: ["240 GSM", "Elastic Waistband", "Deep Pockets", "Stretch Lycra Available"],
  },
  {
    id: "joggers",
    slug: "joggers",
    name: "Joggers",
    navLabel: "Joggers",
    badge: "Tapered Performance Cut",
    headline: "Precision Fit, All-Day Motion.",
    subheadline: "Sporty structure with retail aesthetics.",
    description:
      "Tapered athletic joggers with ribbed ankle cuffs, zippered pockets, and structured drape that keeps its shape wash after wash.",
    image: "/images/joggers-black.png",
    tagline: "Tapered Fit • Ribbed Ankle Cuffs",
    href: "/products/joggers",
    accentColor: "#d4af37",
    features: ["280-320 GSM", "Tapered Ankle", "4-Way Stretch", "Zip Pockets"],
  },
];

interface HeroModelContextType {
  activeModelIndex: number;
  setActiveModelIndex: (index: number) => void;
  activeModel: HeroProductModel;
  activeSlug: string;
  setActiveSlug: (slug: string) => void;
  nextModel: () => void;
  prevModel: () => void;
}

const HeroModelContext = createContext<HeroModelContextType | undefined>(undefined);

export function HeroModelProvider({ children }: { children: React.ReactNode }) {
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  const activeModel = HERO_PRODUCT_MODELS[activeModelIndex] || HERO_PRODUCT_MODELS[0];
  const activeSlug = activeModel.slug;

  const setActiveSlug = (slug: string) => {
    const idx = HERO_PRODUCT_MODELS.findIndex((m) => m.slug === slug);
    if (idx !== -1) {
      setActiveModelIndex(idx);
    }
  };

  const nextModel = () => {
    setActiveModelIndex((prev) => (prev + 1) % HERO_PRODUCT_MODELS.length);
  };

  const prevModel = () => {
    setActiveModelIndex((prev) => (prev - 1 + HERO_PRODUCT_MODELS.length) % HERO_PRODUCT_MODELS.length);
  };

  return (
    <HeroModelContext.Provider
      value={{
        activeModelIndex,
        setActiveModelIndex,
        activeModel,
        activeSlug,
        setActiveSlug,
        nextModel,
        prevModel,
      }}
    >
      {children}
    </HeroModelContext.Provider>
  );
}

export function useHeroModel() {
  const context = useContext(HeroModelContext);
  return context;
}
