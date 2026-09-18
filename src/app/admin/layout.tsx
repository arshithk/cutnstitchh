"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  LogOut,
  Settings,
  FileText,
  ShoppingBag,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // On login or logout page, render children directly without the admin sidebar shell
  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Product Catalog", href: "/admin/products", icon: ShoppingBag },
    { name: "Live Stock", href: "/admin/stock", icon: Package },
    { name: "Quote Requests", href: "/admin/quotes", icon: FileText },
    { name: "Account Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-neutral-800 bg-[#111] md:flex">
        <div className="p-6 border-b border-neutral-800/80">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-sans font-black text-xl tracking-tighter uppercase text-white">
              Cut n <span className="text-[#D4AF37]">Stitch</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest bg-white/10 text-white px-1.5 py-0.5 rounded border border-white/20">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] font-semibold border border-[#D4AF37]/20"
                    : "text-neutral-400 hover:bg-neutral-800/80 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-400 transition-colors hover:bg-red-950/30 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex items-center justify-between border-b border-neutral-800 bg-[#111] p-4 md:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tighter uppercase text-white">
              Cut n <span className="text-[#D4AF37]">Stitch</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest bg-white/10 text-white px-1.5 py-0.5 rounded border border-white/20">
              Admin
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Mobile Nav strip */}
        <div className="flex gap-2 overflow-x-auto border-b border-neutral-800 bg-[#141414] p-2 md:hidden">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  isActive
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Page children */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
