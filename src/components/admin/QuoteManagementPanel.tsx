"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Search,
  RefreshCw,
  Mail,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface QuoteRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  createdAt?: string;
  requirements?: string;
  productSlug?: string;
  quantity?: number;
}

export default function QuoteManagementPanel() {
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadQuotes() {
    setLoading(true);
    setError(null);
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
    setUpdatingId(quoteId);
    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Unable to update quote status");
      
      setQuotes((prev) =>
        prev.map((q) => (q._id === quoteId ? { ...q, status } : q))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update quote");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesStatus = statusFilter === "all" || q.status.toLowerCase() === statusFilter.toLowerCase();
      if (!matchesStatus) return false;

      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase();
      return (
        q.name?.toLowerCase().includes(term) ||
        q.email?.toLowerCase().includes(term) ||
        q.company?.toLowerCase().includes(term) ||
        q.requirements?.toLowerCase().includes(term)
      );
    });
  }, [quotes, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: quotes.length,
      pending: quotes.filter((q) => q.status === "pending").length,
      reviewed: quotes.filter((q) => q.status === "reviewed").length,
      approved: quotes.filter((q) => q.status === "approved").length,
      rejected: quotes.filter((q) => q.status === "rejected").length,
    };
  }, [quotes]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
            <AlertCircle className="h-3 w-3" />
            Reviewed
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/30">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold text-neutral-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-950/50 border border-rose-800/80 p-4 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: "all", label: "All Quotes", count: counts.all },
              { id: "pending", label: "Pending", count: counts.pending },
              { id: "reviewed", label: "Reviewed", count: counts.reviewed },
              { id: "approved", label: "Approved", count: counts.approved },
              { id: "rejected", label: "Rejected", count: counts.rejected },
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40"
                    : "bg-[#111] text-neutral-400 border border-neutral-800 hover:bg-neutral-850 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive ? "bg-[#D4AF37] text-black font-bold" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-[#111] pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
            />
          </div>

          <button
            onClick={() => void loadQuotes()}
            disabled={loading}
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-neutral-800 bg-[#111] text-neutral-400 hover:text-white hover:bg-neutral-800 transition disabled:opacity-50"
            title="Refresh Quotes"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#D4AF37]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Quotes List */}
      <div className="rounded-2xl border border-neutral-800 bg-[#111] overflow-hidden shadow-sm">
        <div className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#D4AF37]" />
            Inquiries Pipeline ({filteredQuotes.length})
          </h2>
        </div>

        {loading && quotes.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-[#D4AF37]" />
            Loading quote requests...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">
            No quote requests found in this view.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/70">
            {filteredQuotes.map((quote) => (
              <div
                key={quote._id}
                className="p-6 transition hover:bg-neutral-900/30 flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Customer Info */}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white">{quote.name}</span>
                      {quote.company && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300 border border-neutral-700">
                          <Building className="h-3 w-3 text-neutral-400" />
                          {quote.company}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-1.5">
                      <a
                        href={`mailto:${quote.email}`}
                        className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {quote.email}
                      </a>
                      {quote.phone && <span>Tel: {quote.phone}</span>}
                      {quote.createdAt && (
                        <span className="inline-flex items-center gap-1 text-neutral-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status controls */}
                  <div className="flex items-center gap-3 self-start md:self-center">
                    {getStatusBadge(quote.status)}

                    <select
                      value={quote.status}
                      disabled={updatingId === quote._id}
                      onChange={(e) => void updateStatus(quote._id, e.target.value)}
                      className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Requirements / Message Details */}
                {quote.requirements ? (
                  <div className="rounded-xl border border-neutral-800/90 bg-neutral-950/50 p-4 text-xs leading-relaxed text-neutral-300">
                    <span className="font-semibold text-neutral-400 block mb-1">
                      Specifications / Inquiry Details:
                    </span>
                    {quote.requirements}
                  </div>
                ) : (
                  <div className="text-xs italic text-neutral-500">
                    No additional details provided.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
