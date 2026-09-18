import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import StockManagementPanel from "@/components/admin/StockManagementPanel";

export const dynamic = "force-dynamic";

export default async function AdminStockPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value ?? null;
  const session = token ? verifyAdminToken(token) : null;
  if (!session || session.email !== "admin@cutnstitch.com") {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Stock Management</h1>
        <p className="text-neutral-400">Update stock quantities for each variant colour.</p>
      </div>
      <StockManagementPanel />
    </div>
  );
}
