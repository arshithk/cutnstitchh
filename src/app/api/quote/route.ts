import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
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

    await dbConnect();
    const quoteRequest = await QuoteRequest.create({
      name,
      company,
      email,
      phone,
      product,
      quantity,
      message: message || "No message provided",
    });

    return NextResponse.json({ ok: true, quoteRequest }, { status: 201 });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to submit quote request" },
      { status },
    );
  }
}
