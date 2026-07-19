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

export default function LiveStockPage() {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("All");

  const stockQuantityByGsm = useMemo(() => {
    const map = new Map<string, number>();

    filteredStockEntries
      .filter((entry) => stockProductTypeToCategorySlug[entry.productType] === selectedCategorySlug)
      .forEach((entry) => {
        const quantity = entry.colors.reduce((sum, item) => sum + item.quantity, 0);
        map.set(entry.gsmRange, (map.get(entry.gsmRange) ?? 0) + quantity);
      });

    return map;
  }, [selectedCategorySlug]);

  const selectedCategoryName = useMemo(
    () => catalogCategories.find((category) => category.slug === selectedCategorySlug)?.name ?? "",
    [selectedCategorySlug]
  );

  const availableProductVariants = useMemo(() => {
    if (selectedCategorySlug === "All") return [];

    const category = catalogCategories.find((item) => item.slug === selectedCategorySlug);
    if (!category) return [];

    return category.variants
      .map((variant) => ({
        slug: variant.slug,
        gsm: variant.gsm,
        fabric: variant.fabric,
        name: variant.name,
        quantity: stockQuantityByGsm.get(variant.gsm) ?? 0,
      }))
      .sort((a, b) => {
        const aNum = Number(a.gsm.replace(/\D/g, ""));
        const bNum = Number(b.gsm.replace(/\D/g, ""));
        return aNum - bNum;
      });
  }, [selectedCategorySlug, stockQuantityByGsm]);

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

        <div className="mt-8">
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
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/80">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C8A64A] dark:text-[#F6D56A]">
              Available Fabric Variants for {selectedCategoryName || selectedCategorySlug}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableProductVariants.map((variant) => (
                <div
                  key={variant.slug}
                  className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-4 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                >
                  <p className="font-semibold">{variant.gsm}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    {variant.fabric}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {variant.quantity} pcs available
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : selectedCategorySlug !== "All" ? (
          <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
            No fabric variants found for the selected product type.
          </div>
        ) : null}
      </div>
    </div>
  );
}
