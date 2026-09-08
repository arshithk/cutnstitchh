import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import AdminSettingsForm from "../AdminSettingsForm";
import SiteSettingsPanel from "@/components/admin/SiteSettingsPanel";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value ?? null;
  if (!token || !verifyAdminToken(token)) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80">
        <div>
          <h1 className="mb-2 text-3xl font-semibold">Account Settings</h1>
          <p className="text-sm text-slate-600">Update your admin credentials and site-wide storefront settings.</p>
        </div>
        <AdminSettingsForm />
        <div className="rounded-2xl border border-slate-200 p-4">
          <h2 className="mb-3 text-xl font-semibold">Site Settings</h2>
          <SiteSettingsPanel />
        </div>
      </div>
    </main>
  );
}
