import "server-only";
import { createClient } from "@supabase/supabase-js";

export function marketplaceAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !process.env.PAYSTACK_SECRET_KEY) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function verifyPaystack(reference: string) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key || !/^[a-zA-Z0-9.=-]{8,100}$/.test(reference)) return null;
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) return null;
  const result = await response.json();
  return result?.status && result?.data?.status === "success" ? result.data : null;
}
