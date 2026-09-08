"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PackageCheck, ArrowLeft } from "lucide-react";

interface StockColorVariant {
  color: string;
  hex: string;
  quantity: number;
}

interface StockEntry {
  slug: string;
  productName: string;
  productType: string;
  fabric: string;
  gsmRange: string;
  lastUpdated: string;
  availableForBulk: boolean;
  colors: StockColorVariant[];
}

// Exclude product types that should not appear in product selection
const excludedProductTypes = ["Tank Top", "Windbreaker"];

const stockProductTypeToCategorySlug: Record<string, string> = {
  "Regular Fit T-Shirt": "regular-fit",
  "Polo Shirt": "polo",
  "Oversized T-Shirt": "oversized",
  Hoodie: "hoodie",
  Sweatshirt: "sweatshirt",
  Jogger: "joggers",
  Shorts: "shorts",
};

// Static mapping for product type selector (label + slug)
const getProductTypes = () => {
  return [
    { label: "Regular Fit", value: "regular-fit" },
    { label: "Polo", value: "polo" },
    { label: "Oversized", value: "oversized" },
    { label: "Hoodie", value: "hoodie" },
    { label: "Sweatshirt", value: "sweatshirt" },
    { label: "Joggers", value: "joggers" },
    { label: "Shorts", value: "shorts" },
  ];
};

export default function LiveStockPage() {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("All");
  const [selectedColorByVariant, setSelectedColorByVariant] = useState<Record<string, string>>({});
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadStock = async () => {
      try {
        const response = await fetch("/api/stock");
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error ?? `Failed to load stock (${response.status})`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected stock response format");
        }

        setStockEntries(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to load stock data.");
      } finally {
        setLoading(false);
      }
    };

    loadStock();
  }, []);

  const filteredStockEntries = useMemo(
    () =>
      stockEntries.filter(
        (entry) =>
          !entry.productName.toLowerCase().includes("uniform") &&
          !entry.productName.toLowerCase().includes("corporate") &&
          !excludedProductTypes.includes(entry.productType),
      ),
    [stockEntries],
  );

  const stockQuantityByGsm = useMemo(() => {
    const map = new Map<string, number>();

    filteredStockEntries
      .filter((entry) => stockProductTypeToCategorySlug[entry.productType] === selectedCategorySlug)
      .forEach((entry) => {
        const quantity = entry.colors.reduce((sum, item) => sum + item.quantity, 0);
        map.set(entry.gsmRange, (map.get(entry.gsmRange) ?? 0) + quantity);
      });

    return map;
  }, [selectedCategorySlug, filteredStockEntries]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategorySlug === "All") return "All Product Types";
    return getProductTypes().find((t) => t.value === selectedCategorySlug)?.label ?? "";
  }, [selectedCategorySlug]);

  const availableProductVariants = useMemo(() => {
    if (selectedCategorySlug === "All") return [];

    // Build variants from stock entries matching the selected category
    const entries = filteredStockEntries.filter(
      (entry) => stockProductTypeToCategorySlug[entry.productType] === selectedCategorySlug,
    );

    const variantsMap = new Map<string, any>();
    for (const entry of entries) {
      const gsm = entry.gsmRange;
      const key = `${gsm}||${entry.fabric}||${entry.slug}`;
      if (!variantsMap.has(key)) {
        const quantity = entry.colors.reduce((sum, c) => sum + c.quantity, 0);
        const colorQuantities = entry.colors.reduce(
          (acc, item) => ({ ...acc, [item.color]: item.quantity }),
          {} as Record<string, number>,
        );
        variantsMap.set(key, {
          slug: entry.slug,
          gsm,
          fabric: entry.fabric,
          name: entry.productName,
          colors: entry.colors.map((c) => ({ name: c.color, hex: c.hex })),
          quantity,
          colorQuantities,
        });
      } else {
        const existing = variantsMap.get(key);
        existing.quantity += entry.colors.reduce((sum: number, c: StockColorVariant) => sum + c.quantity, 0);
        entry.colors.forEach((c) => {
          existing.colorQuantities[c.color] = (existing.colorQuantities[c.color] ?? 0) + c.quantity;
        });
      }
    }

    const variants = Array.from(variantsMap.values()).sort((a, b) => {
      const aNum = Number(String(a.gsm).replace(/\D/g, ""));
      const bNum = Number(String(b.gsm).replace(/\D/g, ""));
      return aNum - bNum;
    });

    return variants;
  }, [selectedCategorySlug, filteredStockEntries]);

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
        {loading && (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-200">
            Fetching latest inventory...
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm dark:border-red-700/50 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}
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
                  <div className="mt-3">
                    {variant.colors.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {variant.colors.map((color: { name: string; hex: string }) => {
                          const colorName = color.name;
                          const isSelected = selectedColorByVariant[variant.slug] === colorName;
                          const quantity = variant.colorQuantities[colorName] ?? 0;
                          return (
                            <button
                              key={colorName}
                              type="button"
                              onClick={() =>
                                setSelectedColorByVariant((prev) => ({
                                  ...prev,
                                  [variant.slug]: colorName,
                                }))
                              }
                              className={`h-3.5 w-3.5 rounded-full border shadow-sm transition focus:outline-none ${
                                isSelected
                                  ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30"
                                  : "border-slate-300"
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={`${colorName} — ${quantity} pcs available`}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        No color data
                      </span>
                    )}
                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {selectedColorByVariant[variant.slug]
                        ? `${variant.colorQuantities[selectedColorByVariant[variant.slug]] ?? 0} pcs available in ${selectedColorByVariant[variant.slug]}`
                        : `Select a color to view stock`}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Overall stock: {variant.quantity} pcs
                    </p>
                  </div>
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
