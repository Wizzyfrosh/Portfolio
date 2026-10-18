import { NextRequest, NextResponse } from "next/server";
import { validSupportEmail, verifySupportContribution } from "@/lib/support-payments";

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
    const reference = typeof input.reference === "string" ? input.reference.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    if (!/^support_[a-f0-9]{32}$/.test(reference) || !validSupportEmail(email))
      return NextResponse.json({ error: "Valid payment reference and email required" }, { status: 400 });
    const result = await verifySupportContribution(reference, email);
    if ("error" in result)
      return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ verified: true, amountKobo: result.contribution.amount_kobo },
      { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not verify support payment" }, { status: 500 });
  }
}
