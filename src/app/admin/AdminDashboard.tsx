import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-3 text-2xl font-semibold">Admin Tools</h2>
        <p className="mb-6 text-sm text-slate-600">
          Manage your admin account and access protected admin pages.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/products"
            className="rounded-3xl bg-white px-5 py-4 text-left shadow-sm shadow-slate-200 transition hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold">Products</h3>
            <p className="mt-2 text-sm text-slate-600">Create, update, and remove catalog products.</p>
          </Link>
          <Link
            href="/admin/stock"
            className="rounded-3xl bg-white px-5 py-4 text-left shadow-sm shadow-slate-200 transition hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold">Live Stock</h3>
            <p className="mt-2 text-sm text-slate-600">Add and review stock entries and availability.</p>
          </Link>
          <Link
            href="/admin/quotes"
            className="rounded-3xl bg-white px-5 py-4 text-left shadow-sm shadow-slate-200 transition hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold">Quotes</h3>
            <p className="mt-2 text-sm text-slate-600">Review inbound quote requests and change statuses.</p>
          </Link>
          <Link
            href="/admin/settings"
            className="rounded-3xl bg-white px-5 py-4 text-left shadow-sm shadow-slate-200 transition hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <p className="mt-2 text-sm text-slate-600">Change admin email and password.</p>
          </Link>
          <Link
            href="/admin/logout"
            className="rounded-3xl bg-white px-5 py-4 text-left shadow-sm shadow-slate-200 transition hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold">Logout</h3>
            <p className="mt-2 text-sm text-slate-600">Sign out securely from the admin session.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
