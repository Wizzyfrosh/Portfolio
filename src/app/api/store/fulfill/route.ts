import { NextRequest, NextResponse } from "next/server";
import { marketplaceAdmin, verifyPaystack } from "@/lib/marketplace-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const db = marketplaceAdmin();
    if (!db) return NextResponse.json({ error: "Store unavailable" }, { status: 503 });
    const payload = await request.json();
    const reference = typeof payload?.reference === "string" ? payload.reference : "";
    const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
    if (!/^[a-zA-Z0-9_.=-]{8,100}$/.test(reference) || !email || email.length > 254) {
      return NextResponse.json({ error: "Reference and purchase email required" }, { status: 400 });
    }
    const { data: order } = await db.from("template_orders").select("id,template_id,email,amount_kobo,currency,status")
      .eq("reference", reference).maybeSingle();
    if (!order || order.email !== email) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const verified = await verifyPaystack(reference);
    if (!verified || verified.reference !== reference ||
      verified.amount !== order.amount_kobo || verified.currency !== order.currency ||
      String(verified.customer?.email || "").toLowerCase() !== email) {
      return NextResponse.json({ error: "Payment not yet verified" }, { status: 409 });
    }
    const { data: template } = await db.from("website_templates").select("file_path")
      .eq("id", order.template_id).maybeSingle();
    if (!template?.file_path) return NextResponse.json({ error: "Template file unavailable. Contact support." }, { status: 503 });
    const { error: updateError } = await db.from("template_orders").update({
      status: "paid", paid_at: new Date().toISOString(),
    }).eq("id", order.id);
    if (updateError) return NextResponse.json({ error: "Could not confirm order" }, { status: 503 });
    const { data, error } = await db.storage.from("template-files").createSignedUrl(template.file_path, 120, { download: true });
    if (error || !data?.signedUrl) return NextResponse.json({ error: "File delivery unavailable. Contact support." }, { status: 503 });
    return NextResponse.json({ downloadUrl: data.signedUrl });
  } catch {
    return NextResponse.json({ error: "Could not verify payment" }, { status: 500 });
  }
}
