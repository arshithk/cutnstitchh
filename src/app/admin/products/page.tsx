import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import ProductManagementPanel from "@/components/admin/ProductManagementPanel";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value ?? null;
  if (!token || !verifyAdminToken(token)) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80">
        <h1 className="mb-4 text-3xl font-semibold">Product Management</h1>
        <p className="mb-6 text-sm text-slate-600">Create, edit, and remove catalog products from the admin dashboard.</p>
        <ProductManagementPanel />
      </div>
    </main>
  );
}
