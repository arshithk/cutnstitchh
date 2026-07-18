"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PackageCheck, ArrowLeft } from "lucide-react";
import { catalogCategories } from "@/data/products";
import { stockEntries } from "@/data/stock";

// Exclude product types that should not appear in product selection
const excludedProductTypes = ["Tank Top", "Windbreaker"];

const filteredStockEntries = stockEntries.filter(
  (entry) =>
    !entry.productName.toLowerCase().includes("uniform") &&
    !entry.productName.toLowerCase().includes("corporate") &&
    !excludedProductTypes.includes(entry.productType)
);

const stockProductTypeToCategorySlug: Record<string, string> = {
  "Regular Fit T-Shirt": "regular-fit",
  "Polo Shirt": "polo",
  "Oversized T-Shirt": "oversized",
  Hoodie: "hoodie",
  Sweatshirt: "sweatshirt",
  Jogger: "joggers",
  Shorts: "shorts",
};

const getProductTypes = () => {
  const allowedSlugs = new Set(Object.values(stockProductTypeToCategorySlug));
  return catalogCategories
    .filter((category) => allowedSlugs.has(category.slug))
    .map((category) => ({
      label: category.name,
      value: category.slug,
    }));
};

function VariantCard({ variant }: { variant: any }) {
  const [selectedColor, setSelectedColor] = useState("All");

  const displayQuantity = selectedColor === "All" 
    ? variant.quantity 
    : variant.colors.find((c: any) => c.color === selectedColor)?.quantity ?? 0;

  const displayFabric = variant.fabric
    .replace(/100% Cotton S-Jersey/gi, "100% Cotton (Bio Washed)")
    .replace(/100% Cotton Piqu[é|e]/gi, "100% Cotton (Bio Washed)")
    .replace(/Premium Cotton Piqu[é|e]/gi, "Premium Cotton (Bio Washed)");

  return (
    <div className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-5 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100 flex flex-col justify-between">
      <div>
        <p className="font-semibold text-base">{variant.gsm}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          {displayFabric}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-700/50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A6A1F] dark:text-[#D4AF37]">
          Color Availability
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedColor("All")}
            className={`py-1.5 px-3 rounded-full text-[10px] font-semibold border transition-all ${
              selectedColor === "All" 
                ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#8A6A1F] dark:text-[#D4AF37]" 
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
             All Options
          </button>
          
          {variant.colors.map((c: any) => (
            <button
              key={c.color}
              title={c.color}
              onClick={() => setSelectedColor(c.color)}
              className={`h-7 w-7 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                selectedColor === c.color 
                  ? "border-[#D4AF37] scale-110" 
                  : "border-slate-200 dark:border-slate-700 hover:scale-105"
              }`}
            >
              <span 
                className="w-full h-full rounded-full border border-black/10 dark:border-white/10" 
                style={{ backgroundColor: c.hex }}
              />
            </button>
          ))}
        </div>
        
        <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-900">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {displayQuantity} pcs <span className="font-normal text-slate-500 text-xs">ready in stock</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function LiveStockPage() {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("All");

  const selectedCategoryName = useMemo(
    () => catalogCategories.find((category) => category.slug === selectedCategorySlug)?.name ?? "",
    [selectedCategorySlug]
  );

  const availableProductVariants = useMemo(() => {
    if (selectedCategorySlug === "All") return [];

    const category = catalogCategories.find((item) => item.slug === selectedCategorySlug);
    if (!category) return [];

    return category.variants
      .map((variant) => {
        // Find matching stock entry based on productType map and gsmRange
        const stockEntry = filteredStockEntries.find(
          entry => stockProductTypeToCategorySlug[entry.productType] === selectedCategorySlug && entry.gsmRange === variant.gsm
        );
        
        // Take colors from the category variant definition (products.ts) to show all options
        const colors = (variant.colors || []).map(vc => {
          // Find matching stock quantity from stockEntry, if available
          const stockColor = stockEntry?.colors.find(sc => sc.color.toLowerCase() === vc.name.toLowerCase());
          return {
            color: vc.name,
            hex: vc.hex,
            quantity: stockColor ? stockColor.quantity : 0
          };
        });
        
        const quantity = colors.reduce((sum, c) => sum + c.quantity, 0);

        return {
          slug: variant.slug,
          gsm: variant.gsm,
          fabric: variant.fabric,
          name: variant.name,
          quantity,
          colors
        };
      })
      .sort((a, b) => {
        const aNum = Number(a.gsm.replace(/\D/g, ""));
        const bNum = Number(b.gsm.replace(/\D/g, ""));
        return aNum - bNum;
      });
  }, [selectedCategorySlug]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="rounded-4xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10 dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-[0_24px_80px_rgba(2,6,23,0.55)] dark:backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700 transition hover:text-accent-custom dark:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A64A] dark:text-[#F6D56A]">
              Live Inventory
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-slate-50">
              Live Stock
            </h1>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-slate-800 dark:text-slate-300">
              Browse premium stock availability by product type and GSM with
              dynamic filters. Explore our diverse range of apparel options.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#FFF8E8] px-4 py-2 text-sm font-semibold text-[#8A6A1F] dark:border-[#D4AF37]/30 dark:bg-[#D4AF37]/15 dark:text-[#F6D56A]">
            <PackageCheck className="h-4 w-4" />
            {selectedCategorySlug === "All"
              ? "Select a product type to review fabric variants"
              : `${availableProductVariants.length} variants available`}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <select
            value={selectedCategorySlug}
            onChange={(event) => setSelectedCategorySlug(event.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-[#D4AF37]"
          >
            <option value="All">Product Type</option>
            {getProductTypes().map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        {selectedCategorySlug !== "All" && availableProductVariants.length > 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/80">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C8A64A] dark:text-[#F6D56A] mb-4">
              Available Fabric Variants for {selectedCategoryName || selectedCategorySlug}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableProductVariants.map((variant) => (
                <VariantCard key={variant.slug} variant={variant} />
              ))}
            </div>
          </div>
        ) : selectedCategorySlug !== "All" ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
            No fabric variants found for the selected product type.
          </div>
        ) : null}
      </div>
    </div>
  );
}
