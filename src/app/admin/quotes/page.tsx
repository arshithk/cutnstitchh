import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import QuoteManagementPanel from "@/components/admin/QuoteManagementPanel";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value ?? null;
  const session = token ? verifyAdminToken(token) : null;
  if (!session || session.email !== "admin@cutnstitch.com") {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Quote Requests</h1>
        <p className="text-neutral-400">Review incoming B2B quote inquiries, custom manufacturing specifications, and order statuses.</p>
      </div>
      <QuoteManagementPanel />
    </div>
  );
}
