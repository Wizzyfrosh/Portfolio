"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentComplete() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref") || "";
  const [email, setEmail] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    try { setEmail(sessionStorage.getItem("froshcodeorbit_buyer_email") || ""); } catch {}
  }, []);
  async function verify(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setStatus(""); setDownloadUrl("");
    try {
      const response = await fetch("/api/store/fulfill", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });
      const result = await response.json();
      if (!response.ok || !result.downloadUrl) throw new Error(result.error || "Payment not confirmed");
      setDownloadUrl(result.downloadUrl);
      setStatus("Payment verified. Your secure download is ready (valid for 2 minutes).");
    } catch (e: unknown) { setStatus(e instanceof Error ? e.message : "Verification failed"); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-gray-50 px-6 py-16 text-gray-900 dark:bg-gray-950 dark:text-white">
    <div className="mx-auto max-w-lg space-y-6 rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h1 className="text-3xl font-bold">Verify Your Purchase</h1>
      <p className="text-gray-500 dark:text-gray-300">We verify your payment securely with Paystack before making your purchased digital product available.</p>
      {reference ? <form className="space-y-4" onSubmit={verify}>
        <label className="block text-sm font-semibold">Email used at checkout
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border p-3 text-gray-900" />
        </label>
        <button disabled={busy} className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Verifying..." : "Verify and get download"}</button>
      </form> : <p className="text-red-600">No payment reference was provided. Return to the store or contact support.</p>}
      {status && <p role="status" className="text-sm">{status}</p>}
      {downloadUrl && <a href={downloadUrl} className="inline-block rounded-full bg-green-600 px-6 py-3 font-bold text-white" rel="noreferrer">Download purchased file</a>}
      <Link href="/store/recover" className="block text-blue-600">Need to recover a previous purchase?</Link>
      <Link href="/store" className="block text-blue-600">Back to store</Link>
    </div>
  </main>;
}
