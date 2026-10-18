import { marketplaceAdmin, verifyPaystack } from "@/lib/marketplace-server";

export const SUPPORT_MIN_KOBO = 10000; // NGN 100
export const SUPPORT_MAX_KOBO = 100000000; // NGN 1,000,000

export function validSupportEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseSupportAmount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const kobo = Math.round(value * 100);
  if (kobo < SUPPORT_MIN_KOBO || kobo > SUPPORT_MAX_KOBO ||
      Math.abs(kobo / 100 - value) > 0.00000001) return null;
  return kobo;
}

export async function verifySupportContribution(reference: string, buyerEmail?: string) {
  const db = marketplaceAdmin();
  if (!db) return { error: "Support payments unavailable", status: 503 } as const;
  if (!/^support_[a-f0-9]{32}$/.test(reference))
    return { error: "Invalid support reference", status: 400 } as const;
  const { data: contribution, error: lookupError } = await db.from("support_contributions")
    .select("id,email,reference,amount_kobo,currency,status").eq("reference", reference).maybeSingle();
  if (lookupError) return { error: "Unable to check contribution", status: 503 } as const;
  if (!contribution) return { error: "Contribution not found", status: 404 } as const;
  if (buyerEmail && contribution.email !== buyerEmail)
    return { error: "Contribution not found", status: 404 } as const;

  const verified = await verifyPaystack(reference);
  if (!verified || verified.reference !== reference ||
      verified.amount !== contribution.amount_kobo ||
      verified.currency !== contribution.currency ||
      String(verified.customer?.email || "").trim().toLowerCase() !== contribution.email) {
    return { error: "Payment not yet verified", status: 409 } as const;
  }
  if (contribution.status !== "paid") {
    const { error } = await db.from("support_contributions")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", contribution.id).eq("status", "pending");
    if (error) return { error: "Unable to confirm contribution", status: 503 } as const;
  }
  return { contribution, status: 200 } as const;
}
