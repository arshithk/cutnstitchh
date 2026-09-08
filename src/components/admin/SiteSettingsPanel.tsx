"use client";

import { useEffect, useState } from "react";

interface SettingsFormState {
  contactEmail: string;
  phoneNumber: string;
  whatsAppNumber: string;
  defaultMoq: string;
  productionLeadTime: string;
}

export default function SiteSettingsPanel() {
  const [form, setForm] = useState<SettingsFormState>({
    contactEmail: "",
    phoneNumber: "",
    whatsAppNumber: "",
    defaultMoq: "",
    productionLeadTime: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/site-settings", { credentials: "include" });
        if (!response.ok) return;
        const data = await response.json();
        if (data) {
          setForm({
            contactEmail: data.contactEmail ?? "",
            phoneNumber: data.phoneNumber ?? "",
            whatsAppNumber: data.whatsAppNumber ?? "",
            defaultMoq: data.defaultMoq ?? "",
            productionLeadTime: data.productionLeadTime ?? "",
          });
        }
      } catch {
        // ignore
      }
    }

    void loadSettings();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Unable to save settings");
      setMessage("Site settings updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {message ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Contact email" value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} />
      <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Phone number" value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} />
      <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="WhatsApp number" value={form.whatsAppNumber} onChange={(event) => setForm({ ...form, whatsAppNumber: event.target.value })} />
      <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Default MOQ" value={form.defaultMoq} onChange={(event) => setForm({ ...form, defaultMoq: event.target.value })} />
      <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Production lead time" value={form.productionLeadTime} onChange={(event) => setForm({ ...form, productionLeadTime: event.target.value })} />
      <button type="submit" disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving…" : "Save settings"}</button>
    </form>
  );
}
