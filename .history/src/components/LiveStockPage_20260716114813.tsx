"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, PackageCheck, ArrowLeft } from "lucide-react";
import { stockEntries, getStockStatus } from "@/data/stock";

// Filter out uniforms and corporate wear
const filteredStockEntries = stockEntries.filter(
  (entry) =>
    !entry.productName.toLowerCase().includes("uniform") &&
    !entry.productName.toLowerCase().includes("corporate")
);

// Get unique product types
const getProductTypes = () => {
  const types = filteredStockEntries.map((entry) => entry.productType);
  return Array.from(new Set(types)).sort();
};

// Get unique GSM values
const getGsmValues = () => {
  const gsms = filteredStockEntries.map((entry) => entry.gsmRange);
  return Array.from(new Set(gsms)).sort();
};

export default function LiveStockPage() {
  const [query, setQuery] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState("All");
  const [gsmFilter, setGsmFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(
    filteredStockEntries[0]?.slug ?? null
  );

  const filteredEntries = useMemo(() => {
    return filteredStockEntries.filter((entry) => {
      // Dynamic search across product name and fabric
      const matchesQuery = `${entry.productName} ${entry.fabric}`
        .toLowerCase()
        .includes(query.toLowerCase());

      // Filter by product type
      const matchesProductType =
        productTypeFilter === "All" || entry.productType === productTypeFilter;

      // Filter by GSM
      const matchesGsm = gsmFilter === "All" || entry.gsmRange === gsmFilter;

      return matchesQuery && matchesProductType && matchesGsm;
    });
  }, [productTypeFilter, gsmFilter, query]);

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
            {filteredEntries.length} products available
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product or fabric"
              className="w-full rounded-full border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-600 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#D4AF37]"
            />
          </label>
          <select
            value={productTypeFilter}
            onChange={(event) => setProductTypeFilter(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-[#D4AF37]"
          >
            <option value="All">Product Type</option>
            {getProductTypes().map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={gsmFilter}
            onChange={(event) => setGsmFilter(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-[#D4AF37]"
          >
            <option value="All">GSM</option>
            {getGsmValues().map((gsm) => (
              <option key={gsm} value={gsm}>
                {gsm}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 space-y-4">
          {filteredEntries.map((entry) => {
            const isOpen = expanded === entry.slug;
            const totalQuantity = entry.colors.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <motion.div
                key={entry.slug}
                layout
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-shadow duration-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(isOpen ? null : entry.slug)
                  }
                  className="flex w-full flex-col gap-4 px-5 py-5 text-left sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A64A] dark:text-[#F6D56A]">
                      {entry.productType} • {entry.gsmRange}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                      {entry.productName}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {entry.fabric}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {totalQuantity} pcs available
                    </span>
                    <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Updated {entry.lastUpdated}
                    </span>
                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#FFF8E8] px-3 py-1 text-sm font-semibold text-[#8A6A1F] dark:border-[#D4AF37]/30 dark:bg-[#D4AF37]/15 dark:text-[#F6D56A]">
                      {entry.availableForBulk ? "Bulk Ready" : "Custom"}
                    </span>
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t border-slate-200 bg-[#F8FAFC] px-5 py-5 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="grid grid-cols-[1fr_auto] bg-slate-100 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-800 dark:bg-slate-800/90 dark:text-slate-300">
                        <span>Colour</span>
                        <span>Available Quantity</span>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {entry.colors.map((item) => {
                          const status = getStockStatus(item.quantity);
                          const badgeClass =
                            status === "In Stock"
                              ? "border border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : status === "Low Stock"
                                ? "border border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                                : "border border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300";

                          return (
                            <div
                              key={item.color}
                              className="grid grid-cols-[1fr_auto] items-center px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/70"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-700"
                                  style={{ backgroundColor: item.hex }}
                                />
                                <span>{item.color}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                  {item.quantity} pcs
                                </span>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                                >
                                  {status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            );
          })}

          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
              No matching inventory entries found. Adjust your filters or search
              query.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
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
            {filteredEntries.length} products available
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product or fabric"
              className="w-full rounded-full border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-600 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#D4AF37]"
            />
          </label>
          <select
            value={productTypeFilter}
            onChange={(event) => setProductTypeFilter(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-[#D4AF37]"
          >
            <option value="All">Product Type</option>
            {getProductTypes().map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={gsmFilter}
            onChange={(event) => setGsmFilter(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-[#D4AF37]"
          >
            <option value="All">GSM</option>
            {getGsmValues().map((gsm) => (
              <option key={gsm} value={gsm}>
                {gsm}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 space-y-4">
          {filteredEntries.map((entry) => {
            const isOpen = expanded === entry.slug;
            const totalQuantity = entry.colors.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <motion.div
                key={entry.slug}
                layout
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-shadow duration-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(isOpen ? null : entry.slug)
                  }
                  className="flex w-full flex-col gap-4 px-5 py-5 text-left sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A64A] dark:text-[#F6D56A]">
                      {entry.productType} • {entry.gsmRange}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                      {entry.productName}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {entry.fabric}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {totalQuantity} pcs available
                    </span>
                    <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Updated {entry.lastUpdated}
                    </span>
                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#FFF8E8] px-3 py-1 text-sm font-semibold text-[#8A6A1F] dark:border-[#D4AF37]/30 dark:bg-[#D4AF37]/15 dark:text-[#F6D56A]">
                      {entry.availableForBulk ? "Bulk Ready" : "Custom"}
                    </span>
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t border-slate-200 bg-[#F8FAFC] px-5 py-5 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="grid grid-cols-[1fr_auto] bg-slate-100 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-800 dark:bg-slate-800/90 dark:text-slate-300">
                        <span>Colour</span>
                        <span>Available Quantity</span>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {entry.colors.map((item) => {
                          const status = getStockStatus(item.quantity);
                          const badgeClass =
                            status === "In Stock"
                              ? "border border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : status === "Low Stock"
                                ? "border border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                                : "border border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300";

                          return (
                            <div
                              key={item.color}
                              className="grid grid-cols-[1fr_auto] items-center px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/70"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-700"
                                  style={{ backgroundColor: item.hex }}
                                />
                                <span>{item.color}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                  {item.quantity} pcs
                                </span>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                                >
                                  {status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            );
          })}

          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
              No matching inventory entries found. Adjust your filters or search
              query.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
