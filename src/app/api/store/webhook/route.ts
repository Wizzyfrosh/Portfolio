import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { confirmPurchase } from "@/lib/store-fulfillment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get("x-paystack-signature") || "";
  if (!key || !/^[0-9a-f]{128}$/i.test(signature)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const raw = await request.text();
  const expected = createHmac("sha512", key).update(raw).digest();
  const supplied = Buffer.from(signature, "hex");
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let event: { event?: string; data?: { reference?: string } };
  try { event = JSON.parse(raw); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  if (event.event !== "charge.success") return NextResponse.json({ received: true });
  const reference = event.data?.reference;
  if (typeof reference !== "string" || !/^[a-zA-Z0-9_.=-]{8,100}$/.test(reference)) {
    return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
  }
  try {
    const result = await confirmPurchase(reference);
    if ("error" in result) {
      // A transaction from a different product or an unknown order is not ours to process.
      if (result.status === 404) return NextResponse.json({ received: true });
      return NextResponse.json({ error: "Verification pending" }, { status: 503 });
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Try again later" }, { status: 503 });
  }
}
