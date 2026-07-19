import { prisma } from "@/lib/prisma";
import StockManager from "./StockManager";

export const dynamic = "force-dynamic";

export default async function StockPage() {
    const stock = await prisma.productStock.findMany({
        orderBy: [
            { productSlug: "asc" },
            { variantSlug: "asc" },
            { color: "asc" },
        ],
    });

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Stock Management</h1>
                <p className="text-neutral-400">Update stock quantities for each variant colour.</p>
            </div>
            <StockManager initialStock={stock} />
        </div>
    );
}
