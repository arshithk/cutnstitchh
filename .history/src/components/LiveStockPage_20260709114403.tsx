"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, PackageCheck } from "lucide-react";
import { stockEntries, getStockStatus } from "@/data/stock";

const uniqueValues = (key: "fabric" | "gsmRange" | "productName") => {
  const values = stockEntries.map((entry) => entry[key]);
  return Array.from(new Set(values));
};

export default function LiveStockPage() {
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState("All");
  const [fabricFilter, setFabricFilter] = useState("All");
  const [gsmFilter, setGsmFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(stockEntries[0]?.slug ?? null);

  const filteredEntries = useMemo(() => {
    return stockEntries.filter((entry) => {
      const matchesQuery = `${entry.productName} ${entry.fabric}`.toLowerCase().includes(query.toLowerCase());
      const matchesProduct = productFilter === "All" || entry.productName === productFilter;
      const matchesFabric = fabricFilter === "All" || entry.fabric === fabricFilter;
      const matchesGsm = gsmFilter === "All" || entry.gsmRange === gsmFilter;
      return matchesQuery && matchesProduct && matchesFabric && matchesGsm;
    });
  }, [fabricFilter, gsmFilter, productFilter, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200/80 bg-[#F8FAFC] p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10 dark:rounded-4xl dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-[0_24px_80px_rgba(2,6,23,0.55)] dark:backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37] dark:text-[#F6D56A]">Live Inventory</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-50">Live Stock</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Browse premium stock availability by product family with a UI designed to support future MongoDB, Firebase, or Supabase-backed inventory APIs.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37] dark:border-[#D4AF37]/30 dark:bg-[#D4AF37]/15 dark:text-[#F6D56A]">
            <PackageCheck className="h-4 w-4" />
            Live availability data from centralized stock structure
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product or fabric"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#D4AF37]"
            />
          </label>
          <select
            value={productFilter}
            onChange={(event) => setProductFilter(event.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:focus:border-accent-custom"
          >
            <option value="All">Product Type</option>
            {uniqueValues("productName").map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select
            value={fabricFilter}
            onChange={(event) => setFabricFilter(event.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:focus:border-accent-custom"
          >
            <option value="All">Fabric</option>
            {Array.from(new Set(stockEntries.map((entry) => entry.fabric))).map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select
            value={gsmFilter}
            onChange={(event) => setGsmFilter(event.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:focus:border-accent-custom"
          >
            <option value="All">GSM</option>
            {Array.from(new Set(stockEntries.map((entry) => entry.gsmRange))).map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="mt-8 space-y-4">
          {filteredEntries.map((entry) => {
            const isOpen = expanded === entry.slug;
            const totalQuantity = entry.colors.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <motion.div key={entry.slug} layout className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition-shadow duration-200 hover:shadow-lg dark:rounded-3xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
                <button type="button" onClick={() => setExpanded(isOpen ? null : entry.slug)} className="flex w-full flex-col gap-4 px-5 py-5 text-left sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37] dark:text-[#F6D56A]">{entry.fabric}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">{entry.productName}</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.gsmRange}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {totalQuantity} pcs available
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Updated {entry.lastUpdated}
                    </span>
                    <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-sm font-medium text-[#D4AF37] dark:border-[#D4AF37]/30 dark:bg-[#D4AF37]/15 dark:text-[#F6D56A]">
                      {entry.availableForBulk ? "Bulk Ready" : "Custom"}
                    </span>
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t border-slate-200 bg-slate-50/90 px-5 py-5 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="grid grid-cols-[1fr_auto] bg-slate-100 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-700 dark:bg-slate-800/90 dark:text-slate-300">
                        <span>Colour</span>
                        <span>Available Quantity</span>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {entry.colors.map((item) => {
                          const status = getStockStatus(item.quantity);
                          const badgeClass =
                            status === "In Stock"
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : status === "Low Stock"
                                ? "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                                : "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300";

                          return (
                            <div key={item.color} className="grid grid-cols-[1fr_auto] items-center px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/70">
                              <div className="flex items-center gap-3">
                                <span className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-700" style={{ backgroundColor: item.hex }} />
                                <span>{item.color}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{item.quantity} pcs</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{status}</span>
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
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
              No matching inventory entries found. Adjust your filters.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
