import SupportWork from "@/components/SupportWork";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support My Work",
  description: "Make a voluntary contribution to support FroshCodeOrbit software projects and learning resources.",
};

export default function SupportPage() {
  return <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 dark:bg-slate-950 md:pt-36">
    <div className="mx-auto max-w-6xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"><ArrowLeft size={16}/> Back to portfolio</Link>
    </div>
    <SupportWork standalone/>
  </main>;
}
