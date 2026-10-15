"use client";

import { useState } from "react";

export default function BuyTemplateButton({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/store/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id, email }),
      });
      const body = await response.json();
      if (!response.ok || !body.url || !String(body.url).startsWith("https://checkout.paystack.com/")) {
        throw new Error(body.error || "Unable to start payment");
      }
      sessionStorage.setItem("froshcodeorbit_buyer_email", email.trim().toLowerCase());
      window.location.assign(body.url);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Checkout failed"); setLoading(false); }
  }
  return <form onSubmit={pay} className="space-y-3">
    <label htmlFor={`buyer-${id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-200">Your email (for purchase verification)</label>
    <input id={`buyer-${id}`} required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
      className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900" placeholder="you@example.com" />
    <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white disabled:opacity-50">
      {loading ? "Preparing checkout..." : "Buy securely with Paystack"}
    </button>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
  </form>;
}
