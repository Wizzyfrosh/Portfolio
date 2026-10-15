import { NextRequest, NextResponse } from "next/server";
import { confirmPurchase } from "@/lib/store-fulfillment";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const reference = typeof payload?.reference === "string" ? payload.reference.trim() : "";
    const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
    if (!/^[a-zA-Z0-9_.=-]{8,100}$/.test(reference) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Valid reference and purchase email required" }, { status: 400 });
    }
    // Email is required for recovery, but is NOT sufficient on its own to authorize delivery.
    // Confirm the transaction with Paystack and match all order details.
    const result = await confirmPurchase(reference, email);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
    if (result.order.email !== email) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const { data: template } = await result.db.from("website_templates").select("file_path")
      .eq("id", result.order.template_id).maybeSingle();
    if (!template?.file_path) return NextResponse.json({ error: "Template file unavailable. Contact support." }, { status: 503 });
    const { data, error } = await result.db.storage.from("template-files")
      .createSignedUrl(template.file_path, 120, { download: true });
    if (error || !data?.signedUrl) return NextResponse.json({ error: "File delivery unavailable. Contact support." }, { status: 503 });
    return NextResponse.json({ downloadUrl: data.signedUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not verify payment" }, { status: 500 });
  }
}
