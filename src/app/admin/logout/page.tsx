"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function logout() {
      const response = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to logout. Please try again.");
        return;
      }
      router.replace("/admin/login");
    }

    logout();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80">
        <h1 className="mb-4 text-3xl font-semibold">Signing out</h1>
        <p className="text-slate-600">Your session is ending. Please wait…</p>
        {error ? <p className="mt-4 rounded-3xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      </div>
    </main>
  );
}
