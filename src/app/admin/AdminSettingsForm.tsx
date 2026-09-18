"use client";

import { useState } from "react";
import { Check, AlertCircle, RefreshCw, Key, Mail, Lock } from "lucide-react";

export default function AdminSettingsForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || undefined,
          password: password || undefined,
          currentPassword,
        }),
      });

      setLoading(false);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Update failed");
        return;
      }

      setEmail("");
      setPassword("");
      setCurrentPassword("");
      setMessage("Account credentials updated successfully.");
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
        <label
          htmlFor="admin-email-input"
          className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400"
        >
          <Mail className="h-3.5 w-3.5 text-[#D4AF37]" />
          New Admin Email (Optional)
        </label>
        <input
          id="admin-email-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@cutnstitch.com"
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
        />
      </div>

      <div>
        <label
          htmlFor="admin-new-password"
          className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400"
        >
          <Key className="h-3.5 w-3.5 text-[#D4AF37]" />
          New Password (Optional)
        </label>
        <input
          id="admin-new-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter new password"
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
        />
      </div>

      <div>
        <label
          htmlFor="admin-current-password"
          className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400"
        >
          <Lock className="h-3.5 w-3.5 text-[#D4AF37]" />
          Current Password (Required for confirmation) *
        </label>
        <input
          id="admin-current-password"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
          placeholder="Enter current password"
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#b89528] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
