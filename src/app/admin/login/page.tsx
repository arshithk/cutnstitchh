import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { Lock } from "lucide-react";
import AdminLoginForm from "../AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-[#111] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/5">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Portal</h1>
          <p className="mt-2 text-xs text-neutral-400">
            Sign in with authorized administrator credentials
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
