import { NextResponse } from "next/server";
import { withDbRetry } from "@/lib/db";
import QuoteRequest from "@/models/QuoteRequest";

function isValidEmail(value: unknown) {
  return typeof value === "string" && /\S+@\S+\.\S+/.test(value);
}

function isValidPhone(value: unknown) {
  return (
    typeof value === "string" &&
    /^\+?[0-9\s-]{10,14}$/.test(value.replace(/\s+/g, ""))
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const product = typeof body.product === "string" ? body.product.trim() : "";
    const quantity = Number(body.quantity);
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !company || !email || !phone || !product || Number.isNaN(quantity) || quantity < 1) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "A valid phone number is required" }, { status: 400 });
    }

    const quoteRequest = await withDbRetry(async () => {
      return await QuoteRequest.create({
        name,
        company,
        email,
        phone,
        product,
        quantity,
        message: message || "No message provided",
      });
    }, 2);

    return NextResponse.json({ ok: true, quoteRequest }, { status: 201 });
  } catch (error) {
    console.error("Quote submission error:", error);
    const rawMsg = (error as Error)?.message || "";

    let userMessage = "Unable to submit inquiry at this moment. Please reach out directly via WhatsApp for an immediate quotation!";
    if (
      rawMsg.includes("buffering timed out") ||
      rawMsg.includes("Cannot connect") ||
      rawMsg.includes("timed out") ||
      rawMsg.includes("ECONNREFUSED")
    ) {
      userMessage = "Our inquiry server is temporarily taking longer to respond. Please click the button below to send your inquiry directly via WhatsApp!";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: 500 },
    );
  }
}
