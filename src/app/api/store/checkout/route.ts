import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { marketplaceAdmin } from "@/lib/marketplace-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 8192) return NextResponse.json({ error: "Request too large" }, { status: 413 });
  try {
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return NextResponse.json({ error: "JSON request required" }, { status: 415 });
    }
    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    const expectedPrefix = process.env.VERCEL_ENV === "production" ? "sk_live_" : "sk_test_";
    if (!secret.startsWith(expectedPrefix)) {
      console.error("Paystack environment is not correctly configured");
      return NextResponse.json({ error: "Checkout is unavailable" }, { status: 503 });
    }
    const db = marketplaceAdmin();
    if (!db) return NextResponse.json({ error: "Checkout is not configured" }, { status: 503 });
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 8192) return NextResponse.json({ error: "Request too large" }, { status: 413 });
    let body: unknown;
    try { body = JSON.parse(raw); }
    catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const templateId = typeof input.templateId === "string" ? body.templateId : "";
    const email = typeof input.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[0-9a-f-]{36}$/i.test(templateId) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Valid template and email are required" }, { status: 400 });
    }
    const { data: template, error: templateError } = await db.from("website_templates")
      .select("id,price_kobo,published").eq("id", templateId).eq("published", true).maybeSingle();
    if (templateError) return NextResponse.json({ error: "Could not load the current price" }, { status: 503 });
    if (!template || !Number.isInteger(template.price_kobo) || template.price_kobo < 100) {
      return NextResponse.json({ error: "Template unavailable" }, { status: 404 });
    }
    // Do not derive payment redirect destinations from the untrusted request Host header.
    const callbackBase = process.env.VERCEL_ENV === "production"
      ? "https://www.froshcodeorbit.site"
      : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
    if (!callbackBase) return NextResponse.json({ error: "Checkout callback not configured" }, { status: 503 });
    const callback_url = new URL("/store/complete", callbackBase).toString();
    // Bound repeat checkout attempts by email in the database, across serverless instances.
    const cutoff = new Date(Date.now() - 60_000).toISOString();
    const { count, error: throttleError } = await db.from("template_orders")
      .select("id", { count: "exact", head: true }).eq("email", email).gte("created_at", cutoff);
    if (throttleError) return NextResponse.json({ error: "Checkout temporarily unavailable" }, { status: 503 });
    if ((count || 0) >= 5) return NextResponse.json({ error: "Too many checkout attempts. Please wait a minute." }, { status: 429 });
    const reference = "frosh_" + randomUUID().replace(/-/g, "");
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
    const result = await paystack.json().catch(() => null);
    let validCheckoutUrl = false;
    try { const checkout = new URL(result.data?.authorization_url); validCheckoutUrl = checkout.protocol === "https:" && checkout.hostname === "checkout.paystack.com"; }
    catch { /* Invalid payment URL */ }
    if (!paystack.ok || !result.status || !validCheckoutUrl || result.data?.reference !== reference) {
      return NextResponse.json({ error: "Payment initialization failed" }, { status: 502 });
    }
    const { error } = await db.from("template_orders").insert({
      template_id: template.id, email, reference, amount_kobo: template.price_kobo, currency: "NGN",
    });
    if (error) return NextResponse.json({ error: "Could not register checkout" }, { status: 503 });
    return NextResponse.json({ url: result.data.authorization_url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
  }
}
