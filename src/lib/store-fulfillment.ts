import { marketplaceAdmin, verifyPaystack } from "@/lib/marketplace-server";

export async function confirmPurchase(reference: string, buyerEmail?: string) {
  const db = marketplaceAdmin();
  if (!db) return { error: "Store unavailable", status: 503 } as const;
  if (!/^[a-zA-Z0-9_.=-]{8,100}$/.test(reference)) return { error: "Invalid reference", status: 400 } as const;

  const { data: order, error: lookupError } = await db.from("template_orders")
    .select("id,template_id,email,amount_kobo,currency,status").eq("reference", reference).maybeSingle();
  if (lookupError) return { error: "Could not check order", status: 503 } as const;
  if (!order) return { error: "Order not found", status: 404 } as const;

  if (buyerEmail && order.email !== buyerEmail) return { error: "Order not found", status: 404 } as const;

  // Even previously confirmed orders are matched against Paystack before re-delivery.
  const verified = await verifyPaystack(reference);
  if (!verified || verified.reference !== reference ||
    verified.amount !== order.amount_kobo || verified.currency !== order.currency ||
    String(verified.customer?.email || "").trim().toLowerCase() !== order.email) {
    return { error: "Payment not yet verified", status: 409 } as const;
  }

  if (order.status !== "paid") {
    const { error: updateError } = await db.from("template_orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", order.id).eq("status", "pending");
    if (updateError) return { error: "Could not confirm order", status: 503 } as const;
  }

  return { order, db, status: 200 } as const;
}
