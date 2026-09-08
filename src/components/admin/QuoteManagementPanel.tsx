"use client";

import { useEffect, useState } from "react";

interface QuoteRecord {
  _id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  createdAt?: string;
  requirements?: string;
}

export default function QuoteManagementPanel() {
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadQuotes() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/quotes", { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load quotes");
      const body = await response.json();
      setQuotes(Array.isArray(body) ? body : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load quotes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadQuotes();
  }, []);

  async function updateStatus(quoteId: string, status: string) {
    setError(null);
    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Unable to update quote");
      await loadQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update quote");
    }
  }

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      <div className="rounded-2xl border border-slate-200">
        <div className="border-b border-slate-200 p-4 text-sm font-semibold">Incoming quotes</div>
        {loading && quotes.length === 0 ? <div className="p-4 text-sm text-slate-600">Loading…</div> : null}
        <div className="divide-y divide-slate-200">
          {quotes.map((quote) => (
            <div key={quote._id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{quote.name}</div>
                <div className="text-sm text-slate-600">{quote.email} • {quote.company || "N/A"}</div>
                <div className="mt-1 text-sm text-slate-600">{quote.requirements || "No details"}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">{quote.status}</span>
                <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" defaultValue={quote.status} onChange={(event) => void updateStatus(quote._id, event.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
