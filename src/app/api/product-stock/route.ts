import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
    try {
        const stock = await prisma.productStock.findMany({
            orderBy: [
                { productSlug: "asc" },
                { variantSlug: "asc" },
                { color: "asc" },
            ],
        });
        return NextResponse.json(stock);
    } catch (error) {
        console.error("Error fetching stock:", error);
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

        const { id, quantity } = await req.json();

        if (!id || typeof quantity !== "number") {
            return NextResponse.json(
                { error: "Invalid data" },
                { status: 400 }
            );
        }

        const updatedStock = await prisma.productStock.update({
            where: { id },
            data: { quantity },
        });

        return NextResponse.json(updatedStock);
    } catch (error) {
        console.error("Error updating stock:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
