import { Suspense } from "react";
import PaymentComplete from "./payment-complete";

export default function StoreComplete() {
  return <Suspense fallback={<main className="p-10">Loading purchase…</main>}><PaymentComplete /></Suspense>;
}
