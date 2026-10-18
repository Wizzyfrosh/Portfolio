"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

const presetAmounts = [500, 1000, 2500, 5000];
const naira = (value: number) => "₦" + value.toLocaleString("en-NG");

export default function SupportWork({ standalone = false }: { standalone?: boolean }) {
  const [amount, setAmount] = useState("1000");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function contribute(event: FormEvent) {
    event.preventDefault();
    setError("");
    const nairaAmount = Number(amount);
    if (!Number.isFinite(nairaAmount) || nairaAmount < 100 || nairaAmount > 1000000 ||
        Math.abs(Math.round(nairaAmount * 100) / 100 - nairaAmount) > 0.00000001) {
      setError("Enter an amount between ₦100 and ₦1,000,000."); return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/support/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), amountNaira: nairaAmount }),
      });
      const result = await response.json();
      if (!response.ok || !result.url || !String(result.url).startsWith("https://checkout.paystack.com/"))
        throw new Error(result.error || "Unable to initialize support payment");
      try { sessionStorage.setItem("froshcodeorbit_support_email", email.trim().toLowerCase()); } catch {}
      window.location.assign(result.url);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Support payment could not start.");
      setBusy(false);
    }
  }

  return <section id="support" className={standalone
    ? "py-12"
    : "scroll-mt-28 bg-slate-50 py-20 dark:bg-slate-900/70 sm:py-24"}>
    <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 sm:px-6">
      <div className="max-w-xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[.15em] text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"><HeartHandshake size={15}/> Support independent development</p>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Support my work <span className="text-blue-600">and future projects.</span></h2>
        <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">Enjoying my projects or learning resources? You can make a voluntary contribution to support the time and resources behind new software, tutorials and open learning.</p>
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Sparkles size={18} className="text-blue-600"/> Any amount is appreciated. Supporting is completely optional.</div>
      </div>
      <form onSubmit={contribute} className="min-w-0 space-y-5 rounded-[25px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_-40px_rgba(15,23,42,.28)] dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <div>
          <label className="block text-sm font-bold text-slate-800 dark:text-white">Choose a contribution</label>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {presetAmounts.map(value => <button type="button" key={value} aria-pressed={Number(amount) === value}
              onClick={() => setAmount(String(value))}
              className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${Number(amount) === value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"}`}>
              {naira(value)}
            </button>)}
          </div>
        </div>
        <label className="block text-sm font-bold text-slate-800 dark:text-white">Custom amount (NGN)
          <input type="number" min={100} max={1000000} step="0.01" inputMode="decimal" required
            value={amount} onChange={event => setAmount(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </label>
        <label className="block text-sm font-bold text-slate-800 dark:text-white">Your email (for payment verification)
          <input type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </label>
        <button type="submit" disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60">
          {busy ? "Preparing secure payment…" : "Support with Paystack"} {!busy && <ArrowUpRight size={18}/>}
        </button>
        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
        <p className="flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-blue-600"/> Payments are securely processed by Paystack. This contribution is voluntary and does not purchase a downloadable product.</p>
      </form>
    </div>
  </section>;
}
