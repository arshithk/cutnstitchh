"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Save,
  Check,
  Plus,
  Search,
  RefreshCw,
  Package,
  Sparkles,
  X,
} from "lucide-react";

interface ColorItem {
  color: string;
  hex: string;
  quantity: number;
}

interface StockRecord {
  _id: string;
  slug: string;
  productName: string;
  productType: string;
  fabric: string;
  gsmRange: string;
  lastUpdated: string;
  availableForBulk: boolean;
  colors: ColorItem[];
}

export default function StockManagementPanel() {
  const [stocks, setStocks] = useState<StockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState({
    slug: "",
    productName: "",
    productType: "Oversized T-Shirt",
    fabric: "100% Super Combed Cotton",
    gsmRange: "180 GSM",
    colorName: "Black",
    colorHex: "#111111",
    colorQty: 250,
  });

  async function loadStocks() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/stock", { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load stock");
      const body = await response.json();
      const list: StockRecord[] = Array.isArray(body) ? body : [];
      setStocks(list);

      // Expand all categories by default
      const cats: Record<string, boolean> = {};
      const vars: Record<string, boolean> = {};
      list.forEach((s) => {
        cats[s.productType || "Other"] = true;
        vars[s.slug] = true;
      });
      setExpandedCategories((prev) => (Object.keys(prev).length === 0 ? cats : prev));
      setExpandedVariants((prev) => (Object.keys(prev).length === 0 ? vars : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load stock");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStocks();
  }, []);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleVariant = (slug: string) => {
    setExpandedVariants((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleQuantityChange = (stockSlug: string, colorIndex: number, newQty: string) => {
    const qty = parseInt(newQty, 10);
    const validQty = isNaN(qty) ? 0 : Math.max(0, qty);

    setStocks((prev) =>
      prev.map((s) => {
        if (s.slug !== stockSlug) return s;
        const newColors = [...(s.colors || [])];
        if (newColors[colorIndex]) {
          newColors[colorIndex] = { ...newColors[colorIndex], quantity: validQty };
        }
        return { ...s, colors: newColors };
      })
    );
  };

  const handleSaveStock = async (stock: StockRecord) => {
    setSavingSlug(stock.slug);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/stock/${stock.slug}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: stock.slug,
          productName: stock.productName,
          productType: stock.productType,
          fabric: stock.fabric,
          gsmRange: stock.gsmRange,
          availableForBulk: stock.availableForBulk ?? true,
          colors: stock.colors,
          lastUpdated: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setSavedSlug(stock.slug);
        setTimeout(() => setSavedSlug(null), 2500);
      } else {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Save failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingSlug(null);
    }
  };

  const handleCreateNewStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const slug = newEntry.slug.trim() || newEntry.productName.toLowerCase().replace(/\s+/g, "-");
      const res = await fetch("/api/admin/stock", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          productName: newEntry.productName.trim(),
          productType: newEntry.productType.trim(),
          fabric: newEntry.fabric.trim(),
          gsmRange: newEntry.gsmRange.trim(),
          lastUpdated: new Date().toISOString(),
          availableForBulk: true,
          colors: [
            {
              color: newEntry.colorName.trim() || "Black",
              hex: newEntry.colorHex || "#111111",
              quantity: Number(newEntry.colorQty) || 250,
            },
          ],
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Failed to add stock");
      setMessage("New stock entry added successfully.");
      setShowAddForm(false);
      await loadStocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add stock");
    }
  };

  // Distinct categories from stock entries
  const distinctCategories = useMemo(() => {
    return Array.from(new Set(stocks.map((s) => s.productType).filter(Boolean)));
  }, [stocks]);

  // Filter stocks by category filter and search query
  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      if (selectedCategoryFilter !== "All" && s.productType !== selectedCategoryFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.productName.toLowerCase().includes(q) ||
        s.productType.toLowerCase().includes(q) ||
        s.fabric.toLowerCase().includes(q) ||
        s.gsmRange.toLowerCase().includes(q) ||
        s.colors?.some((c) => c.color.toLowerCase().includes(q))
      );
    });
  }, [stocks, selectedCategoryFilter, searchQuery]);

  // Group stocks by productType
  const grouped = useMemo(() => {
    const map: Record<string, StockRecord[]> = {};
    for (const item of filteredStocks) {
      const cat = item.productType || "General Apparel";
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    }
    return map;
  }, [filteredStocks]);

  // Overall statistics
  const totalPieces = useMemo(() => {
    return stocks.reduce(
      (sum, s) => sum + (s.colors || []).reduce((cSum, c) => cSum + (c.quantity || 0), 0),
      0
    );
  }, [stocks]);

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {message && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-950/50 border border-emerald-800/80 p-4 text-sm text-emerald-300">
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-950/50 border border-rose-800/80 p-4 text-sm text-rose-300">
          <X className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Top Metric & Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search variant name, GSM, fabric, color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-[#111] pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
          />
        </div>

        {/* Buttons and Counter */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-neutral-800 bg-[#111] px-3.5 py-2 text-xs text-neutral-300">
            <Package className="h-4 w-4 text-[#D4AF37]" />
            <span>
              <strong className="text-white">{totalPieces.toLocaleString()}</strong> pcs in stock
            </span>
          </div>

          <button
            onClick={() => void loadStocks()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-[#111] px-3.5 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition disabled:opacity-50"
            title="Refresh Live Stock"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#D4AF37]" : ""}`} />
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#b89528] transition shadow-lg shadow-[#D4AF37]/10"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? "Close Form" : "Add Stock Variant"}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategoryFilter("All")}
          className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            selectedCategoryFilter === "All"
              ? "bg-[#D4AF37] text-black font-bold"
              : "bg-[#111] text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          All Product Types ({stocks.length})
        </button>
        {distinctCategories.map((cat) => {
          const count = stocks.filter((s) => s.productType === cat).length;
          const isActive = selectedCategoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-[#D4AF37] text-black font-bold"
                  : "bg-[#111] text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive ? "bg-black/20 text-black" : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add Entry Form Modal/Accordion */}
      {showAddForm && (
        <form
          onSubmit={handleCreateNewStock}
          className="rounded-2xl border border-neutral-800 bg-[#111] p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-base font-bold text-white">Add New Live Stock Entry</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Product Name *</label>
              <input
                required
                value={newEntry.productName}
                onChange={(e) => setNewEntry({ ...newEntry, productName: e.target.value })}
                placeholder="e.g. Oversized Heavyweight Tee"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Category / Product Type *</label>
              <input
                required
                value={newEntry.productType}
                onChange={(e) => setNewEntry({ ...newEntry, productType: e.target.value })}
                placeholder="e.g. Oversized T-Shirt"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Slug (URL identifier)</label>
              <input
                value={newEntry.slug}
                onChange={(e) => setNewEntry({ ...newEntry, slug: e.target.value })}
                placeholder="e.g. oversized-heavyweight-tee"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Fabric</label>
              <input
                value={newEntry.fabric}
                onChange={(e) => setNewEntry({ ...newEntry, fabric: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">GSM Range</label>
              <input
                value={newEntry.gsmRange}
                onChange={(e) => setNewEntry({ ...newEntry, gsmRange: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Initial Color & Hex</label>
              <div className="flex gap-2">
                <input
                  value={newEntry.colorName}
                  onChange={(e) => setNewEntry({ ...newEntry, colorName: e.target.value })}
                  placeholder="Color Name"
                  className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
                <input
                  type="color"
                  value={newEntry.colorHex}
                  onChange={(e) => setNewEntry({ ...newEntry, colorHex: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-neutral-700 bg-neutral-900 p-1 cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-neutral-700 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#D4AF37] px-5 py-2 text-xs font-semibold text-black hover:bg-[#b89528]"
            >
              Save New Entry
            </button>
          </div>
        </form>
      )}

      {/* Accordion List (Original Dark Layout from 93c14e8) */}
      {loading && stocks.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-[#111] p-12 text-center text-neutral-400">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-[#D4AF37]" />
          Loading live stock inventory…
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-[#111] p-12 text-center text-neutral-400">
          No stock variants found matching your search.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, items]) => {
            const isCatExpanded = expandedCategories[category] ?? true;
            const categoryPieces = items.reduce(
              (sum, it) => sum + (it.colors || []).reduce((cSum, c) => cSum + (c.quantity || 0), 0),
              0
            );

            return (
              <div
                key={category}
                className="rounded-2xl border border-neutral-800 bg-[#111] overflow-hidden shadow-sm"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between p-5 hover:bg-neutral-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white tracking-tight">{category}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-[#D4AF37] border border-neutral-700 font-semibold">
                      {items.length} {items.length === 1 ? "Variant" : "Variants"}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                      ({categoryPieces.toLocaleString()} pcs)
                    </span>
                  </div>
                  {isCatExpanded ? (
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-neutral-400" />
                  )}
                </button>

                {/* Variants inside Category */}
                {isCatExpanded && (
                  <div className="border-t border-neutral-800 divide-y divide-neutral-800/60">
                    {items.map((stock) => {
                      const isVarExpanded = expandedVariants[stock.slug] ?? true;
                      const isSaving = savingSlug === stock.slug;
                      const isSaved = savedSlug === stock.slug;
                      const variantPieces = (stock.colors || []).reduce(
                        (sum, c) => sum + (c.quantity || 0),
                        0
                      );

                      return (
                        <div key={stock.slug} className="bg-neutral-900/30">
                          {/* Variant Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-3">
                            <button
                              onClick={() => toggleVariant(stock.slug)}
                              className="flex items-center gap-3 text-left hover:text-white group"
                            >
                              {isVarExpanded ? (
                                <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-white shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-white shrink-0" />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-neutral-200 group-hover:text-white">
                                    {stock.productName}
                                  </span>
                                  <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800/80 px-2 py-0.2 rounded border border-neutral-700">
                                    {variantPieces} pcs ready
                                  </span>
                                </div>
                                <span className="text-xs text-neutral-400 mt-0.5 block">
                                  {stock.fabric} • {stock.gsmRange} • {stock.colors?.length || 0} Colors
                                </span>
                              </div>
                            </button>

                            <button
                              onClick={() => handleSaveStock(stock)}
                              disabled={isSaving}
                              className="flex items-center justify-center gap-2 self-end sm:self-center rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50 shrink-0"
                            >
                              {isSaved ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Saved</span>
                                </>
                              ) : isSaving ? (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#D4AF37]" />
                                  <span>Saving…</span>
                                </>
                              ) : (
                                <>
                                  <Save className="h-3.5 w-3.5" />
                                  <span>Save Variant</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Color Swatch Grid */}
                          {isVarExpanded && (
                            <div className="px-6 sm:px-8 pb-5 pt-1">
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {(stock.colors || []).map((c, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-[#111] p-3 shadow-sm hover:border-neutral-700 transition"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span
                                        className="h-5 w-5 rounded-full border border-white/20 shrink-0 shadow-sm"
                                        style={{ backgroundColor: c.hex || "#222" }}
                                      />
                                      <span className="text-xs font-medium text-neutral-300 truncate">
                                        {c.color}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <input
                                        type="number"
                                        min="0"
                                        value={c.quantity}
                                        onChange={(e) =>
                                          handleQuantityChange(stock.slug, cIdx, e.target.value)
                                        }
                                        className="w-20 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-right text-xs font-medium text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                                      />
                                      <span className="text-[11px] text-neutral-500">pcs</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
