import { Suspense } from "react";
import SupportComplete from "./support-complete";

export default function SupportCompletionPage() {
  return <Suspense fallback={<main className="min-h-screen p-10">Checking payment…</main>}><SupportComplete /></Suspense>;
}
