"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        setError(result?.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-950/50 border border-rose-800/80 p-3.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="admin-login-email"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400"
        >
          Admin Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            id="admin-login-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@cutnstitch.com"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="admin-login-password"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            id="admin-login-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-[#D4AF37] focus:outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3.5 text-sm font-bold text-black transition-all hover:bg-[#C8A64A] disabled:opacity-50 shadow-lg shadow-[#D4AF37]/10"
      >
        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Authenticating…</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
