"use client";

import Link from "next/link";
import {
  Package,
  DollarSign,
  Shirt,
  Settings,
  FileText,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";

interface AdminDashboardProps {
  stockCount: number;
  pricingCount: number;
  totalQuantity: number;
}

export default function AdminDashboard({
  stockCount,
  pricingCount,
  totalQuantity,
}: AdminDashboardProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
        <p className="text-neutral-400">Welcome to the Cut n Stitch admin portal.</p>
      </div>

      {/* Three Overview Metric Cards (Original Look from 93c14e8) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Products tracking stock
            </h3>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0">
              <Shirt className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {stockCount}{" "}
            <span className="text-sm font-medium text-neutral-500">Variants</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Total Items in Stock
            </h3>
            <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex-shrink-0">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {totalQuantity.toLocaleString()}{" "}
            <span className="text-sm font-medium text-neutral-500">Pieces</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Priced Products
            </h3>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {pricingCount}{" "}
            <span className="text-sm font-medium text-neutral-500">Products</span>
          </div>
        </div>
      </div>

      {/* Quick Actions / Management Cards */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Management Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products"
            className="group rounded-2xl border border-neutral-800 bg-[#111] p-5 transition-all hover:border-[#D4AF37]/40 hover:bg-[#161616]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-[#D4AF37]" />
            </div>
            <h3 className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
              Product Catalog
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Add, edit, or remove catalog products & pricing tiers.
            </p>
          </Link>

          <Link
            href="/admin/stock"
            className="group rounded-2xl border border-neutral-800 bg-[#111] p-5 transition-all hover:border-[#D4AF37]/40 hover:bg-[#161616]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Package className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-[#D4AF37]" />
            </div>
            <h3 className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
              Live Stock
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Update warehouse stock levels, colors, and availability.
            </p>
          </Link>

          <Link
            href="/admin/quotes"
            className="group rounded-2xl border border-neutral-800 bg-[#111] p-5 transition-all hover:border-[#D4AF37]/40 hover:bg-[#161616]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <FileText className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-[#D4AF37]" />
            </div>
            <h3 className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
              Quote Requests
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Review and follow up with B2B wholesale inquiries.
            </p>
          </Link>

          <Link
            href="/admin/settings"
            className="group rounded-2xl border border-neutral-800 bg-[#111] p-5 transition-all hover:border-[#D4AF37]/40 hover:bg-[#161616]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300">
                <Settings className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-[#D4AF37]" />
            </div>
            <h3 className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
              Account Settings
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Change credentials, company phone, email & lead times.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
