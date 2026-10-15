import type { SupabaseClient } from "@supabase/supabase-js";

type Purchase = { id: string; template_id: string; email: string; reference: string; amount_kobo: number; currency: string };

export async function sendPurchaseReceipt(db: SupabaseClient, order: Purchase): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return; // Email is opt-in; never block ZIP delivery.
  if (!/^frosh_[a-zA-Z0-9_.=-]{8,100}$/.test(order.reference)) return;

  const { data: state, error: stateError } = await db.from("template_orders")
    .select("status,receipt_sent_at").eq("id", order.id).maybeSingle();
  if (stateError || state?.status !== "paid" || state.receipt_sent_at) return;

  const { data: template } = await db.from("website_templates")
    .select("title").eq("id", order.template_id).maybeSingle();
  const title = template?.title || "Website Template";
  // Use the current preview's URL for preview deliveries; fixed public domain for production.
  const base = process.env.VERCEL_ENV === "production"
    ? (process.env.NEXT_PUBLIC_SITE_URL || "https://www.froshcodeorbit.site")
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_SITE_URL);
  if (!base) return;
  let recoveryUrl: string;
  try {
    const link = new URL("/store/complete", base);
    link.searchParams.set("reference", order.reference);
    recoveryUrl = link.toString();
  } catch { return; }
  const price = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(order.amount_kobo / 100);
  const message = [
    "Thank you for purchasing a website template from Frosh CodeOrbit.",
    `Template: ${title}`,
    `Amount: ${price}`,
    `Paystack reference: ${order.reference}`,
    "",
    "Retrieve your purchased ZIP securely at:",
    recoveryUrl,
    "",
    "Enter the email address used at checkout to verify your purchase and generate a fresh download link.",
    "For security, download links expire after two minutes. Keep this email to recover your order.",
  ].join("\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `frosh-receipt-${order.reference}`,
    },
    body: JSON.stringify({
      from,
      to: [order.email],
      subject: `Your Frosh CodeOrbit purchase: ${title}`,
      text: message,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    console.error("Receipt delivery failed", response.status);
    return;
  }
  // Resend accepts an idempotency key, guarding against repeated calls for 24h.
  const { error: updateError } = await db.from("template_orders")
    .update({ receipt_sent_at: new Date().toISOString() })
    .eq("id", order.id).is("receipt_sent_at", null);
  if (updateError) console.error("Could not mark receipt delivered");
}
