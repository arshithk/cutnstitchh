"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, DollarSign, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Stock Management", href: "/admin/dashboard/stock", icon: Package },
        { name: "Price Management", href: "/admin/dashboard/pricing", icon: DollarSign },
    ];

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-neutral-800 bg-[#111] hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <span className="font-sans font-black text-xl tracking-tighter uppercase text-white">
                            Cut n <span className="text-[#D4AF37]">Stitch</span>
                        </span>
                        <span className="text-[9px] uppercase font-bold tracking-widest bg-white/10 text-white px-1.5 py-0.5 rounded border border-white/20">
                            Admin
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${isActive
                                        ? "bg-[#D4AF37]/10 text-[#D4AF37] font-semibold"
                                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-800">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden p-6 md:p-10">
                {children}
            </main>
        </div>
    );
}
