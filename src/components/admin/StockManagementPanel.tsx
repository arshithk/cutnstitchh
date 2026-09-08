"use client";

import { useEffect, useState } from "react";

interface StockRecord {
  _id: string;
  slug: string;
  productName: string;
  productType: string;
  fabric: string;
  gsmRange: string;
  lastUpdated: string;
  availableForBulk: boolean;
  colors: Array<{ color: string; hex: string; quantity: number }>;
}

export default function StockManagementPanel() {
  const [stocks, setStocks] = useState<StockRecord[]>([]);
  const [form, setForm] = useState({
    slug: "",
    productName: "",
    productType: "",
    fabric: "",
    gsmRange: "",
    lastUpdated: "",
    availableForBulk: true,
    colorName: "",
    colorHex: "#111827",
    colorQty: "0",
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadStocks() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/stock", { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load stock");
      const body = await response.json();
      setStocks(Array.isArray(body) ? body : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load stock");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStocks();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/stock", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug,
          productName: form.productName,
          productType: form.productType,
          fabric: form.fabric,
          gsmRange: form.gsmRange,
          lastUpdated: form.lastUpdated || new Date().toISOString().slice(0, 10),
          availableForBulk: form.availableForBulk,
          colors: [
            {
              color: form.colorName || "Default",
              hex: form.colorHex || "#111827",
              quantity: Number(form.colorQty || 0),
            },
          ],
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Unable to save stock");
      setMessage("Stock entry saved.");
      setForm({
        slug: "",
        productName: "",
        productType: "",
        fabric: "",
        gsmRange: "",
        lastUpdated: "",
        availableForBulk: true,
        colorName: "",
        colorHex: "#111827",
        colorQty: "0",
      });
      await loadStocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save stock");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {message ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <form onSubmit={save} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Product name" value={form.productName} onChange={(event) => setForm({ ...form, productName: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Product type" value={form.productType} onChange={(event) => setForm({ ...form, productType: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Fabric" value={form.fabric} onChange={(event) => setForm({ ...form, fabric: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="GSM range" value={form.gsmRange} onChange={(event) => setForm({ ...form, gsmRange: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Last updated" value={form.lastUpdated} onChange={(event) => setForm({ ...form, lastUpdated: event.target.value })} required />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Color name" value={form.colorName} onChange={(event) => setForm({ ...form, colorName: event.target.value })} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Color hex" value={form.colorHex} onChange={(event) => setForm({ ...form, colorHex: event.target.value })} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Color quantity" type="number" value={form.colorQty} onChange={(event) => setForm({ ...form, colorQty: event.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.availableForBulk} onChange={(event) => setForm({ ...form, availableForBulk: event.target.checked })} />
          Available for bulk
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" disabled={loading}>Save stock</button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200">
        <div className="border-b border-slate-200 p-4 text-sm font-semibold">Stock entries</div>
        <div className="divide-y divide-slate-200">
          {stocks.map((stock) => (
            <div key={stock._id} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{stock.productName}</div>
                <div className="text-sm text-slate-600">{stock.slug} • {stock.productType}</div>
              </div>
              <div className="text-sm text-slate-600">{stock.colors?.[0]?.color || "No color"} • {stock.availableForBulk ? "Bulk ready" : "Limited"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
