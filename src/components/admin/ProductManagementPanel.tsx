"use client";

import { useEffect, useMemo, useState } from "react";

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
  pricingInput: string;
}

interface ProductRecord extends ProductFormState {
  _id: string;
  pricing?: Array<{ min: number; max?: number; price: number }>;
  colors?: Array<{ name: string; hex: string; imagePath: string }>;
  sizes?: string[];
  variants?: Array<{ slug: string; name: string; gsmRange: string; fabric: string; description: string; heroImage: string; colors: Array<{ name: string; hex: string; imagePath: string }>; sizes: string[]; moq: string; pricing?: Array<{ min: number; max?: number; price: number }> }>;
}

const emptyForm: ProductFormState = {
  slug: "",
  name: "",
  category: "",
  tagline: "",
  moq: "100 Pieces",
  fabric: "",
  gsmRange: "",
  description: "",
  heroImage: "",
  availableForBulk: true,
  premiumQuality: false,
  deliveryTimeline: "",
  inquiryOnly: false,
  pricingInput: "100,999,175;1000,5000,173;5001,,170",
};

export default function ProductManagementPanel() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products", { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load products");
      const body = await response.json();
      setProducts(Array.isArray(body) ? body : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const pricing = form.pricingInput
        .split(";")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const [min, max, price] = entry.split(",").map((value) => value.trim());
          return {
            min: Number(min),
            max: max ? Number(max) : undefined,
            price: Number(price),
          };
        });

      const payload = { ...form, pricing };
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
      setMessage(editingSlug ? "Product updated." : "Product created.");
      setForm(emptyForm);
      setEditingSlug(null);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product");
    } finally {
      setLoading(false);
    }
  }

  async function removeProduct(slug: string) {
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${slug}`, {
        method: "DELETE",
        credentials: "include",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Unable to delete product");
      setMessage("Product deleted.");
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete product");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(product: ProductRecord) {
    setEditingSlug(product.slug);
    setForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      tagline: product.tagline,
      moq: product.moq,
      fabric: product.fabric,
      gsmRange: product.gsmRange,
      description: product.description,
      heroImage: product.heroImage,
      availableForBulk: product.availableForBulk,
      premiumQuality: product.premiumQuality,
      deliveryTimeline: product.deliveryTimeline,
      inquiryOnly: product.inquiryOnly,
      pricingInput: (product.pricing || []).map((tier: any) => `${tier.min}${tier.max !== undefined ? `,${tier.max}` : ""},${tier.price}`).join(";"),
    });
  }

  const selectedProduct = useMemo(() => products.find((product) => product.slug === editingSlug) || null, [products, editingSlug]);

  return (
    <div className="space-y-6">
      {message ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Tagline" value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="MOQ" value={form.moq} onChange={(event) => setForm({ ...form, moq: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Fabric" value={form.fabric} onChange={(event) => setForm({ ...form, fabric: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="GSM Range" value={form.gsmRange} onChange={(event) => setForm({ ...form, gsmRange: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Hero image" value={form.heroImage} onChange={(event) => setForm({ ...form, heroImage: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Delivery timeline" value={form.deliveryTimeline} onChange={(event) => setForm({ ...form, deliveryTimeline: event.target.value })} />
        <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Pricing tiers (min,max,price;...)" value={form.pricingInput} onChange={(event) => setForm({ ...form, pricingInput: event.target.value })} />
        <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required rows={4} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.availableForBulk} onChange={(event) => setForm({ ...form, availableForBulk: event.target.checked })} />
          Available for bulk
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.premiumQuality} onChange={(event) => setForm({ ...form, premiumQuality: event.target.checked })} />
          Premium quality
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.inquiryOnly} onChange={(event) => setForm({ ...form, inquiryOnly: event.target.checked })} />
          Inquiry only
        </label>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" disabled={loading}>{editingSlug ? "Update product" : "Create product"}</button>
          {editingSlug ? <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 text-sm" onClick={() => { setEditingSlug(null); setForm(emptyForm); }}>Cancel</button> : null}
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200">
        <div className="border-b border-slate-200 p-4 text-sm font-semibold">Existing products</div>
        {loading && products.length === 0 ? <div className="p-4 text-sm text-slate-600">Loading…</div> : null}
        <div className="divide-y divide-slate-200">
          {products.map((product) => (
            <div key={product._id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-slate-600">{product.slug} • {product.category}</div>
                {selectedProduct?.slug === product.slug ? <div className="mt-1 text-xs text-emerald-700">Editing</div> : null}
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" onClick={() => startEdit(product)}>Edit</button>
                <button type="button" className="rounded-xl border border-rose-300 px-3 py-2 text-sm text-rose-700" onClick={() => void removeProduct(product.slug)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
