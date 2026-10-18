"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, HeartHandshake } from "lucide-react";

export default function SupportComplete() {
  const query = useSearchParams();
  const reference = query.get("reference") || query.get("trxref") || "";
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try { setEmail(sessionStorage.getItem("froshcodeorbit_support_email") || ""); } catch {}
  }, []);

  async function verify(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/support/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });
      const data = await response.json();
      if (!response.ok || !data.verified) throw new Error(data.error || "Payment has not been confirmed.");
      setVerified(true);
      setAmount(data.amountKobo / 100);
    } catch (caught: unknown) {
      setStatus(caught instanceof Error ? caught.message : "Verification failed. Please try again.");
    } finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-28 dark:bg-slate-950 md:pt-36">
    <div className="mx-auto max-w-lg rounded-[25px] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
      {verified ? <div className="space-y-4 text-center">
        <CheckCircle2 size={52} className="mx-auto text-emerald-600"/>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Thank you for your support!</h1>
        <p className="text-slate-600 dark:text-slate-300">Your ₦{amount.toLocaleString("en-NG")} contribution was confirmed securely with Paystack.</p>
        <Link href="/" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">Back to portfolio</Link>
      </div> : <div className="space-y-5">
        <HeartHandshake size={40} className="text-blue-600"/>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Confirm your support</h1>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">We verify your contribution directly with Paystack before showing confirmation.</p>
        {reference ? <form onSubmit={verify} className="space-y-4">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Email used for payment
            <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-slate-900 dark:border-slate-700"/>
          </label>
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-60">{busy ? "Verifying…" : "Verify contribution"}</button>
        </form> : <p className="text-rose-600">No payment reference was provided.</p>}
        {status && <p role="status" className="text-sm text-rose-600">{status}</p>}
        <Link href="/support" className="block text-sm font-semibold text-blue-600">Return to Support My Work</Link>
      </div>}
    </div>
  </main>;
}
