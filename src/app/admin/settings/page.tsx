import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import AdminSettingsForm from "./AdminSettingsForm";
import SiteSettingsPanel from "@/components/admin/SiteSettingsPanel";
import { Shield, Sliders } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value ?? null;
  const session = token ? verifyAdminToken(token) : null;
  if (!session || session.email !== "admin@cutnstitch.com") {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Account & Site Settings</h1>
        <p className="text-neutral-400">Update your admin credentials and site-wide storefront parameters.</p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Shield className="h-5 w-5 text-[#D4AF37]" />
          Admin Credentials
        </h2>
        <AdminSettingsForm />
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Sliders className="h-5 w-5 text-[#D4AF37]" />
          Storefront & Operations Settings
        </h2>
        <SiteSettingsPanel />
      </div>
    </div>
  );
}
