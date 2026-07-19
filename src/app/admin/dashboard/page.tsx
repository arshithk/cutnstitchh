import { prisma } from "@/lib/prisma";
import { Package, DollarSign, Shirt } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const stockCount = await prisma.productStock.count();
    const pricingCount = await prisma.productPricing.count();

    const totalQuantityResult = await prisma.productStock.aggregate({
        _sum: { quantity: true },
    });

    const totalQuantity = totalQuantityResult._sum.quantity || 0;

    return (
        <div className="max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
                <p className="text-neutral-400">Welcome to the Cut n Stitch admin portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-sm flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Products tracking stock</h3>
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0">
                            <Shirt className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{stockCount} <span className="text-sm font-medium text-neutral-500">Variants</span></div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-sm flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Total Items in Stock</h3>
                        <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex-shrink-0">
                            <Package className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{totalQuantity.toLocaleString()} <span className="text-sm font-medium text-neutral-500">Pieces</span></div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-[#111] p-6 shadow-sm flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Priced Products</h3>
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{pricingCount} <span className="text-sm font-medium text-neutral-500">Products</span></div>
                </div>
            </div>
        </div>
    );
}
