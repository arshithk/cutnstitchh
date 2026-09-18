"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, RefreshCw, Mail, Phone, MessageSquare, Package, Clock } from "lucide-react";

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
      setMessage("Storefront settings updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      {message && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-950/50 border border-emerald-800/80 p-3.5 text-sm text-emerald-300">
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-950/50 border border-rose-800/80 p-3.5 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Mail className="h-3.5 w-3.5 text-[#D4AF37]" />
            Official Contact Email
          </label>
          <input
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
            placeholder="orders@cutnstitch.com"
            value={form.contactEmail}
            onChange={(event) => setForm({ ...form, contactEmail: event.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Phone className="h-3.5 w-3.5 text-[#D4AF37]" />
            Direct Phone Number
          </label>
          <input
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
            placeholder="+91 98765 43210"
            value={form.phoneNumber}
            onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <MessageSquare className="h-3.5 w-3.5 text-[#D4AF37]" />
            WhatsApp Business Number
          </label>
          <input
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
            placeholder="919876543210"
            value={form.whatsAppNumber}
            onChange={(event) => setForm({ ...form, whatsAppNumber: event.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Package className="h-3.5 w-3.5 text-[#D4AF37]" />
            Default Catalog MOQ
          </label>
          <input
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
            placeholder="100 Pieces"
            value={form.defaultMoq}
            onChange={(event) => setForm({ ...form, defaultMoq: event.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
            Standard Production Lead Time
          </label>
          <input
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
            placeholder="7 - 10 Business Days"
            value={form.productionLeadTime}
            onChange={(event) => setForm({ ...form, productionLeadTime: event.target.value })}
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-black transition hover:bg-[#b89528] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Storefront Settings"
          )}
        </button>
      </div>
    </form>
  );
}
