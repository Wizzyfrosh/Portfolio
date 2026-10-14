import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { marketplaceAdmin } from "@/lib/marketplace-server";

export async function POST(request: NextRequest) {
  try {
    const db = marketplaceAdmin();
    if (!db) return NextResponse.json({ error: "Checkout is not configured" }, { status: 503 });
    const body = await request.json();
    const templateId = typeof body?.templateId === "string" ? body.templateId : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[0-9a-f-]{36}$/i.test(templateId) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Valid template and email are required" }, { status: 400 });
    }
    const { data: template } = await db.from("website_templates")
      .select("id,price_kobo,published").eq("id", templateId).eq("published", true).maybeSingle();
    if (!template || !Number.isInteger(template.price_kobo) || template.price_kobo < 100) {
      return NextResponse.json({ error: "Template unavailable" }, { status: 404 });
    }
    const reference = "frosh_" + randomUUID().replace(/-/g, "");
    const callback_url = new URL("/store/complete", request.nextUrl.origin).toString();
    const paystack = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, amount: String(template.price_kobo), currency: "NGN", reference, callback_url }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const result = await paystack.json();
    if (!paystack.ok || !result.status || !result.data?.authorization_url || result.data?.reference !== reference) {
      return NextResponse.json({ error: "Payment initialization failed" }, { status: 502 });
    }
    const { error } = await db.from("template_orders").insert({
      template_id: template.id, email, reference, amount_kobo: template.price_kobo, currency: "NGN",
    });
    if (error) return NextResponse.json({ error: "Could not register checkout" }, { status: 503 });
    return NextResponse.json({ url: result.data.authorization_url });
  } catch {
    return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
  }
}
