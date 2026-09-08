import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import AdminLoginForm from "../AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value ?? null;
  if (token && verifyAdminToken(token)) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80">
        <h1 className="mb-4 text-3xl font-semibold">Admin Login</h1>
        <p className="mb-6 text-slate-600">
          Sign in to manage catalog and admin settings.
        </p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
