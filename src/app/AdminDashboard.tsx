import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-3 text-2xl font-semibold">Admin Tools</h2>
        <p className="mb-6 text-sm text-slate-600">
          Use the API endpoints to manage the admin account and catalog.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/settings"
            className="rounded-3xl bg-white px-5 py-4 text-left shadow-sm shadow-slate-200 transition hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <p className="mt-2 text-sm text-slate-600">Change admin email and password.</p>
          </Link>
          <Link
            href="/admin/login"
            className="rounded-3xl bg-white px-5 py-4 text-left shadow-sm shadow-slate-200 transition hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold">Logout</h3>
            <p className="mt-2 text-sm text-slate-600">End your session securely.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
