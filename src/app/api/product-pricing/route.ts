import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
    try {
        const pricing = await prisma.productPricing.findMany({
            orderBy: [
                { productSlug: "asc" },
                { variantSlug: "asc" },
            ],
        });
        return NextResponse.json(pricing);
    } catch (error) {
        console.error("Error fetching pricing:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const auth = await requireAuth(req);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, price_100_999, price_1000_4999, price_5000_plus } = await req.json();

        if (!id || typeof price_100_999 !== "number" || typeof price_1000_4999 !== "number" || typeof price_5000_plus !== "number") {
            return NextResponse.json(
                { error: "Invalid data" },
                { status: 400 }
            );
        }

        const updatedPricing = await prisma.productPricing.update({
            where: { id },
            data: { price_100_999, price_1000_4999, price_5000_plus },
        });

        return NextResponse.json(updatedPricing);
    } catch (error) {
        console.error("Error updating price:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
