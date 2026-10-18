// Pure validation shared by the support checkout API and server-side verification.
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
