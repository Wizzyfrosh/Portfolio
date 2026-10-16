import { NextRequest, NextResponse } from "next/server";
import { confirmPurchase } from "@/lib/store-fulfillment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "JSON request required" }, { status: 415 });
  }
  if (Number(request.headers.get("content-length") || 0) > 8192) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 8192) return NextResponse.json({ error: "Request too large" }, { status: 413 });
    let payload: unknown;
    try { payload = JSON.parse(raw); }
    catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const input = payload as Record<string, unknown>;
    const reference = typeof input.reference === "string" ? input.reference.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    if (!/^[a-zA-Z0-9_.=-]{8,100}$/.test(reference) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Valid reference and purchase email required" }, { status: 400 });
    }
    // Email is required for recovery, but is NOT sufficient on its own to authorize delivery.
    // Confirm the transaction with Paystack and match all order details.
    const result = await confirmPurchase(reference, email);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
    if (result.order.email !== email) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const { data: template } = await result.db.from("website_templates").select("file_path,product_type")
      .eq("id", result.order.template_id).maybeSingle();
    if (!template?.file_path) return NextResponse.json({ error: "Template file unavailable. Contact support." }, { status: 503 });
    const expectedExtension = template.product_type === "ebook" ? ".pdf" : ".zip";
    if (!template.file_path.toLowerCase().endsWith(expectedExtension)) return NextResponse.json({ error: "Product download is misconfigured. Contact support." }, { status: 503 });
    const { data, error } = await result.db.storage.from("template-files")
      .createSignedUrl(template.file_path, 120, { download: true });
    if (error || !data?.signedUrl) return NextResponse.json({ error: "File delivery unavailable. Contact support." }, { status: 503 });
    return NextResponse.json({ downloadUrl: data.signedUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not verify payment" }, { status: 500 });
  }
}
