import { prisma } from "@/lib/prisma";
import PricingManager from "./PricingManager";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
    const pricing = await prisma.productPricing.findMany({
        orderBy: [
            { productSlug: "asc" },
            { variantSlug: "asc" },
        ],
    });

    return (
        <div className="max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Price Management</h1>
                <p className="text-neutral-400">Update the base price for each product variant.</p>
            </div>
            <PricingManager initialPricing={pricing} />
        </div>
    );
}
