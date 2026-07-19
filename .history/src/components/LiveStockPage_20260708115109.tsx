"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, PackageCheck } from "lucide-react";
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
      <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-custom">Live Inventory</p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Live Stock</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-custom">
              Browse premium stock availability by product family with a UI designed to support future MongoDB, Firebase, or Supabase-backed inventory APIs.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-accent-custom/20 bg-accent-custom/10 px-4 py-2 text-sm text-accent-custom">
            <PackageCheck className="h-4 w-4" />
            Live availability data from centralized stock structure
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-custom" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product or fabric"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-custom"
            />
          </label>
          <select value={productFilter} onChange={(event) => setProductFilter(event.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
            <option value="All">Product Type</option>
            {uniqueValues("productName").map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select value={fabricFilter} onChange={(event) => setFabricFilter(event.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
            <option value="All">Fabric</option>
            {Array.from(new Set(stockEntries.map((entry) => entry.fabric))).map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select value={gsmFilter} onChange={(event) => setGsmFilter(event.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
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
              <motion.div key={entry.slug} layout className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40">
                <button type="button" onClick={() => setExpanded(isOpen ? null : entry.slug)} className="flex w-full flex-col gap-4 px-5 py-5 text-left sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-custom">{entry.fabric}</p>
                    <h2 className="mt-2 text-xl font-semibold text-foreground">{entry.productName}</h2>
                    <p className="mt-2 text-sm text-muted-custom">{entry.gsmRange}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                      {totalQuantity} pcs available
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-muted-custom">
                      Updated {entry.lastUpdated}
                    </span>
                    <span className="rounded-full border border-accent-custom/20 bg-accent-custom/10 px-3 py-1 text-sm text-accent-custom">
                      {entry.availableForBulk ? "Bulk Ready" : "Custom"}
                    </span>
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t border-white/10 bg-white/5 px-5 py-5">
                    <div className="overflow-hidden rounded-[1.25rem] border border-white/10">
                      <div className="grid grid-cols-[1fr_auto] bg-black/50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">
                        <span>Colour</span>
                        <span>Available Quantity</span>
                      </div>
                      <div className="divide-y divide-white/10">
                        {entry.colors.map((item) => {
                          const status = getStockStatus(item.quantity);
                          const badgeClass =
                            status === "In Stock"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : status === "Low Stock"
                                ? "bg-amber-500/10 text-amber-300"
                                : "bg-rose-500/10 text-rose-300";

                          return (
                            <div key={item.color} className="grid grid-cols-[1fr_auto] items-center px-4 py-3 text-sm text-foreground">
                              <div className="flex items-center gap-3">
                                <span className="h-3.5 w-3.5 rounded-full border border-white/40" style={{ backgroundColor: item.hex }} />
                                <span>{item.color}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{item.quantity} pcs</span>
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
            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-muted-custom">
              No matching inventory entries found. Adjust your filters.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
