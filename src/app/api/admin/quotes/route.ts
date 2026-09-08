import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import QuoteRequest from "@/models/QuoteRequest";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET(request: Request) {
  try {
    requireAdminSession(request);
    await dbConnect();
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(quotes);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load quote requests" },
      { status },
    );
  }
}
