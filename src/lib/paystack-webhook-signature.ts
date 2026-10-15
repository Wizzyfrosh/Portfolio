import { createHmac, timingSafeEqual } from "node:crypto";

/** Verify the signature against the exact unmodified request body. */
export function isValidPaystackSignature(raw: string, signature: string | null, key: string | undefined): boolean {
  if (!key || !signature || !/^[a-f0-9]{128}$/i.test(signature)) return false;
  const expected = createHmac("sha512", key).update(raw).digest();
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}
