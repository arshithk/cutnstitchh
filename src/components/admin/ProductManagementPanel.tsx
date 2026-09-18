"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Save,
  Check,
  Plus,
  Search,
  Edit3,
  Trash2,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  X,
  RefreshCw,
} from "lucide-react";

interface PricingTier {
  min: number;
  max?: number;
  price: number;
}

interface ProductRecord {
  _id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  moq: string;
  fabric: string;
  gsmRange: string;
  description: string;
  heroImage: string;
  availableForBulk: boolean;
  premiumQuality: boolean;
  deliveryTimeline: string;
  inquiryOnly: boolean;
  pricing?: PricingTier[];
  colors?: Array<{ name: string; hex: string; imagePath: string }>;
  sizes?: string[];
  variants?: Array<{
    slug: string;
    name: string;
    gsmRange: string;
    fabric: string;
    description: string;
    heroImage: string;
    colors: Array<{ name: string; hex: string; imagePath: string }>;
    sizes: string[];
    moq: string;
    pricing?: PricingTier[];
  }>;
}

interface ProductFormState {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  moq: string;
  fabric: string;
  gsmRange: string;
  description: string;
  heroImage: string;
  availableForBulk: boolean;
  premiumQuality: boolean;
  deliveryTimeline: string;
  inquiryOnly: boolean;
  pricing_100_999: number;
  pricing_1000_4999: number;
  pricing_5000_plus: number;
}

const emptyForm: ProductFormState = {
  slug: "",
  name: "",
  category: "",
  tagline: "",
  moq: "100 Pieces",
  fabric: "100% Super Combed Cotton",
  gsmRange: "180 - 240 GSM",
  description: "",
  heroImage: "/images/products/crewneck.webp",
  availableForBulk: true,
  premiumQuality: true,
  deliveryTimeline: "7-10 Business Days",
  inquiryOnly: false,
  pricing_100_999: 175,
  pricing_1000_4999: 173,
  pricing_5000_plus: 170,
};

export default function ProductManagementPanel() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Local state for pricing values while typing: { [productSlug]: { p100: number, p1000: number, p5000: number } }
  const [pricingEdits, setPricingEdits] = useState<Record<string, { p100: number; p1000: number; p5000: number }>>({});
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/products", { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load products");
      const body = await response.json();
      const list: ProductRecord[] = Array.isArray(body) ? body : [];
      setProducts(list);

      // Initialize pricing edits state from products
      const edits: Record<string, { p100: number; p1000: number; p5000: number }> = {};
      const initialExpanded: Record<string, boolean> = {};

      for (const p of list) {
        const p100 = p.pricing?.find((t) => t.min === 100)?.price ?? (p.pricing?.[0]?.price ?? 175);
        const p1000 = p.pricing?.find((t) => t.min === 1000)?.price ?? (p.pricing?.[1]?.price ?? 173);
        const p5000 = p.pricing?.find((t) => (t.min ?? 0) >= 5000)?.price ?? (p.pricing?.[2]?.price ?? 170);
        edits[p.slug] = { p100, p1000, p5000 };

        const cat = p.category || "General";
        initialExpanded[cat] = true;
      }

      setPricingEdits(edits);
      setExpandedCategories((prev) => (Object.keys(prev).length === 0 ? initialExpanded : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handlePriceInputChange = (slug: string, tier: "p100" | "p1000" | "p5000", val: string) => {
    const num = parseFloat(val);
    const valid = isNaN(num) ? 0 : num;
    setPricingEdits((prev) => ({
      ...prev,
      [slug]: {
        ...(prev[slug] || { p100: 175, p1000: 173, p5000: 170 }),
        [tier]: valid,
      },
    }));
  };

  const handleSaveTierPricing = async (product: ProductRecord) => {
    setSavingSlug(product.slug);
    setError(null);
    setMessage(null);

    const edit = pricingEdits[product.slug] || { p100: 175, p1000: 173, p5000: 170 };
    const pricing: PricingTier[] = [
      { min: 100, max: 999, price: edit.p100 },
      { min: 1000, max: 5000, price: edit.p1000 },
      { min: 5001, price: edit.p5000 },
    ];

    try {
      const response = await fetch(`/api/admin/products/${product.slug}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricing }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to update pricing");
      }

      setSavedSlug(product.slug);
      setTimeout(() => setSavedSlug(null), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingSlug(null);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const grouped = useMemo(() => {
    const groups: Record<string, ProductRecord[]> = {};
    for (const p of filteredProducts) {
      const cat = p.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    }
    return groups;
  }, [filteredProducts]);

  const startEditProduct = (product: ProductRecord) => {
    const edit = pricingEdits[product.slug] || { p100: 175, p1000: 173, p5000: 170 };
    setEditingSlug(product.slug);
    setForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      tagline: product.tagline || "",
      moq: product.moq || "100 Pieces",
      fabric: product.fabric || "",
      gsmRange: product.gsmRange || "",
      description: product.description || "",
      heroImage: product.heroImage || "",
      availableForBulk: product.availableForBulk ?? true,
      premiumQuality: product.premiumQuality ?? true,
      deliveryTimeline: product.deliveryTimeline || "7-10 Business Days",
      inquiryOnly: product.inquiryOnly ?? false,
      pricing_100_999: edit.p100,
      pricing_1000_4999: edit.p1000,
      pricing_5000_plus: edit.p5000,
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAddNew = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const pricing: PricingTier[] = [
        { min: 100, max: 999, price: form.pricing_100_999 },
        { min: 1000, max: 5000, price: form.pricing_1000_4999 },
        { min: 5001, price: form.pricing_5000_plus },
      ];

      const payload = {
        slug: form.slug,
        name: form.name,
        category: form.category,
        tagline: form.tagline,
        moq: form.moq,
        fabric: form.fabric,
        gsmRange: form.gsmRange,
        description: form.description,
        heroImage: form.heroImage,
        availableForBulk: form.availableForBulk,
        premiumQuality: form.premiumQuality,
        deliveryTimeline: form.deliveryTimeline,
        inquiryOnly: form.inquiryOnly,
        pricing,
      };

      const url = editingSlug ? `/api/admin/products/${editingSlug}` : "/api/admin/products";
      const method = editingSlug ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Unable to save product");

      setMessage(editingSlug ? "Product updated successfully." : "Product created successfully.");
      setIsFormOpen(false);
      setEditingSlug(null);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete product "${slug}"?`)) return;
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to delete product");
      }
      setMessage("Product deleted.");
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
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

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search products by name, category, fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-[#111] pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadProducts()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-[#111] px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#D4AF37]" : ""}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <button
            onClick={() => (isFormOpen ? setIsFormOpen(false) : startAddNew())}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#b89528] transition shadow-lg shadow-[#D4AF37]/10"
          >
            {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{isFormOpen ? "Close Form" : "Add Product"}</span>
          </button>
        </div>
      </div>

      {/* Full Edit / Add Product Form Drawer */}
      {isFormOpen && (
        <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingSlug ? `Edit Product: ${form.name}` : "Create New Catalog Product"}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Configure full product specifications, fabrics, and pricing tiers.
              </p>
            </div>
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingSlug(null);
              }}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Classic Round Neck T-Shirt"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Slug (Unique Identifier) *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingSlug)}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="e.g. classic-round-neck"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. T-Shirts"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Tagline
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="e.g. Everyday Premium Quality"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Fabric *
                </label>
                <input
                  type="text"
                  required
                  value={form.fabric}
                  onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                  placeholder="e.g. 100% Super Combed Cotton"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  GSM Range *
                </label>
                <input
                  type="text"
                  required
                  value={form.gsmRange}
                  onChange={(e) => setForm({ ...form, gsmRange: e.target.value })}
                  placeholder="e.g. 180 - 240 GSM"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Minimum Order Quantity (MOQ)
                </label>
                <input
                  type="text"
                  value={form.moq}
                  onChange={(e) => setForm({ ...form, moq: e.target.value })}
                  placeholder="e.g. 100 Pieces"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Hero Image Path *
                </label>
                <input
                  type="text"
                  required
                  value={form.heroImage}
                  onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                  placeholder="/images/products/crewneck.webp"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Delivery Timeline
                </label>
                <input
                  type="text"
                  value={form.deliveryTimeline}
                  onChange={(e) => setForm({ ...form, deliveryTimeline: e.target.value })}
                  placeholder="e.g. 7-10 Business Days"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed product specification and description..."
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Tiered Pricing Configuration */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#D4AF37]" />
                Tiered Volume Pricing (₹ INR per Piece)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Tier 100 - 999 Pcs</label>
                  <div className="flex items-center rounded-lg border border-neutral-700 bg-neutral-900 px-3 focus-within:border-[#D4AF37]">
                    <span className="text-neutral-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={form.pricing_100_999}
                      onChange={(e) => setForm({ ...form, pricing_100_999: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-transparent py-2 pl-2 text-right text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Tier 1000 - 4999 Pcs</label>
                  <div className="flex items-center rounded-lg border border-neutral-700 bg-neutral-900 px-3 focus-within:border-[#D4AF37]">
                    <span className="text-neutral-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={form.pricing_1000_4999}
                      onChange={(e) => setForm({ ...form, pricing_1000_4999: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-transparent py-2 pl-2 text-right text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Tier 5000+ Pcs</label>
                  <div className="flex items-center rounded-lg border border-neutral-700 bg-neutral-900 px-3 focus-within:border-[#D4AF37]">
                    <span className="text-neutral-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={form.pricing_5000_plus}
                      onChange={(e) => setForm({ ...form, pricing_5000_plus: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-transparent py-2 pl-2 text-right text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6 text-sm text-neutral-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.availableForBulk}
                  onChange={(e) => setForm({ ...form, availableForBulk: e.target.checked })}
                  className="rounded border-neutral-700 bg-neutral-900 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                Available for Bulk
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.premiumQuality}
                  onChange={(e) => setForm({ ...form, premiumQuality: e.target.checked })}
                  className="rounded border-neutral-700 bg-neutral-900 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                Premium Quality Badge
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inquiryOnly}
                  onChange={(e) => setForm({ ...form, inquiryOnly: e.target.checked })}
                  className="rounded border-neutral-700 bg-neutral-900 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                Inquiry Only (Hide instant cart)
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingSlug(null);
                }}
                className="rounded-xl border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-black hover:bg-[#b89528] transition disabled:opacity-50"
              >
                {loading ? "Saving..." : editingSlug ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Accordion List by Category (Restoring Earlier Git Commit PricingManager UX) */}
      <div className="space-y-4">
        {loading && products.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-[#111] p-12 text-center text-neutral-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-[#D4AF37]" />
            Loading catalog products...
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-[#111] p-12 text-center text-neutral-400">
            No products found matching your search.
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => {
            const isCatExpanded = expandedCategories[category] ?? true;
            return (
              <div
                key={category}
                className="rounded-2xl border border-neutral-800 bg-[#111] overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between p-5 hover:bg-neutral-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white tracking-tight">{category}</h2>
                    <span className="rounded-full bg-neutral-800/80 px-2.5 py-0.5 text-xs font-semibold text-[#D4AF37] border border-neutral-700">
                      {items.length} {items.length === 1 ? "Product" : "Products"}
                    </span>
                  </div>
                  {isCatExpanded ? (
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-neutral-400" />
                  )}
                </button>

                {isCatExpanded && (
                  <div className="border-t border-neutral-800 divide-y divide-neutral-800/60 bg-neutral-950/40">
                    {items.map((item) => {
                      const edit = pricingEdits[item.slug] || {
                        p100: item.pricing?.[0]?.price ?? 175,
                        p1000: item.pricing?.[1]?.price ?? 173,
                        p5000: item.pricing?.[2]?.price ?? 170,
                      };
                      const isSaving = savingSlug === item.slug;
                      const isSaved = savedSlug === item.slug;

                      return (
                        <div
                          key={item._id || item.slug}
                          className="flex flex-col xl:flex-row xl:items-center justify-between p-5 gap-4 hover:bg-neutral-900/30 transition"
                        >
                          {/* Product Info */}
                          <div className="flex flex-col min-w-[240px]">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-semibold text-white">{item.name}</span>
                              {item.premiumQuality && (
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                                  Premium
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-neutral-400 mt-1">
                              {item.fabric} • {item.gsmRange} • MOQ: {item.moq}
                            </span>
                            <span className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                              Slug: {item.slug}
                            </span>
                          </div>

                          {/* Tiered Price Inputs (Exact styling from 13f69b5 PricingManager) */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 self-start xl:self-center">
                            <div className="flex items-center gap-2">
                              <span className="w-16 text-xs text-neutral-400 font-medium">100-999</span>
                              <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-lg focus-within:border-[#D4AF37] px-2.5 w-28 transition-all">
                                <span className="text-neutral-500 text-sm">₹</span>
                                <input
                                  type="number"
                                  value={edit.p100}
                                  onChange={(e) =>
                                    handlePriceInputChange(item.slug, "p100", e.target.value)
                                  }
                                  className="w-full bg-transparent py-1.5 text-right text-sm text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="w-20 text-xs text-neutral-400 font-medium">1000-4999</span>
                              <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-lg focus-within:border-[#D4AF37] px-2.5 w-28 transition-all">
                                <span className="text-neutral-500 text-sm">₹</span>
                                <input
                                  type="number"
                                  value={edit.p1000}
                                  onChange={(e) =>
                                    handlePriceInputChange(item.slug, "p1000", e.target.value)
                                  }
                                  className="w-full bg-transparent py-1.5 text-right text-sm text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="w-14 text-xs text-neutral-400 font-medium">5000+</span>
                              <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-lg focus-within:border-[#D4AF37] px-2.5 w-28 transition-all">
                                <span className="text-neutral-500 text-sm">₹</span>
                                <input
                                  type="number"
                                  value={edit.p5000}
                                  onChange={(e) =>
                                    handlePriceInputChange(item.slug, "p5000", e.target.value)
                                  }
                                  className="w-full bg-transparent py-1.5 text-right text-sm text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Save Price, Edit Specs, Delete */}
                          <div className="flex items-center gap-2 self-end xl:self-center shrink-0 mt-2 xl:mt-0">
                            <button
                              onClick={() => void handleSaveTierPricing(item)}
                              disabled={isSaving}
                              className="flex items-center justify-center h-10 px-4 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-[#D4AF37] hover:text-black transition-colors disabled:opacity-50 text-sm font-medium"
                              title="Save Tiered Pricing"
                            >
                              {isSaved ? (
                                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                  <Check className="h-4 w-4 text-emerald-400" />
                                  Saved
                                </span>
                              ) : isSaving ? (
                                <span className="flex items-center gap-1.5 text-neutral-400">
                                  <RefreshCw className="h-4 w-4 animate-spin text-[#D4AF37]" />
                                  Saving
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5">
                                  <Save className="h-4 w-4" />
                                  Save
                                </span>
                              )}
                            </button>

                            <button
                              onClick={() => startEditProduct(item)}
                              className="flex items-center justify-center h-10 px-3 rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                              title="Edit Full Product Specs"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => void handleDelete(item.slug)}
                              className="flex items-center justify-center h-10 px-3 rounded-lg border border-rose-900/40 text-rose-400 hover:bg-rose-950/30 transition"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
