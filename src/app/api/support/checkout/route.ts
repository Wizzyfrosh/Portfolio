import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { marketplaceAdmin } from "@/lib/marketplace-server";
import { parseSupportAmount, validSupportEmail } from "@/lib/support-payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return NextResponse.json({ error: "JSON request required" }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 8192)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 8192)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const input = parsed as Record<string, unknown>;
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const amountKobo = parseSupportAmount(input.amountNaira);
    if (!validSupportEmail(email) || amountKobo === null)
      return NextResponse.json({ error: "Provide a valid email and amount between ₦100 and ₦1,000,000" }, { status: 400 });

    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    const expectedPrefix = process.env.VERCEL_ENV === "production" ? "sk_live_" : "sk_test_";
    if (!secret.startsWith(expectedPrefix))
      return NextResponse.json({ error: "Support checkout is not configured" }, { status: 503 });
    const db = marketplaceAdmin();
    if (!db) return NextResponse.json({ error: "Support checkout unavailable" }, { status: 503 });

    const cutoff = new Date(Date.now() - 60_000).toISOString();
    const { count, error: countError } = await db.from("support_contributions")
      .select("id", { count: "exact", head: true }).eq("email", email).gte("created_at", cutoff);
    if (countError) return NextResponse.json({ error: "Please try again later" }, { status: 503 });
    if ((count || 0) >= 5)
      return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });

    const reference = "support_" + randomUUID().replace(/-/g, "");
    const base = process.env.VERCEL_ENV === "production"
      ? "https://www.froshcodeorbit.site"
      : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
    if (!base) return NextResponse.json({ error: "Support callback unavailable" }, { status: 503 });
    const callback_url = new URL("/support/complete", base).toString();
    const paystack = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount: String(amountKobo), currency: "NGN", reference, callback_url,
        metadata: { purpose: "support_froshcodeorbit" } }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const result = await paystack.json().catch(() => null);
    let validUrl = false;
    try { const url = new URL(result?.data?.authorization_url); validUrl = url.protocol === "https:" && url.hostname === "checkout.paystack.com"; }
    catch {}
    if (!paystack.ok || !result?.status || !validUrl || result?.data?.reference !== reference)
      return NextResponse.json({ error: "Could not initialize support payment" }, { status: 502 });

    const { error } = await db.from("support_contributions").insert({
      email, reference, amount_kobo: amountKobo, currency: "NGN",
    });
    if (error) return NextResponse.json({ error: "Could not register support payment" }, { status: 503 });
    return NextResponse.json({ url: result.data.authorization_url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to start support payment" }, { status: 500 });
  }
}
