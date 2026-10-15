import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, LayoutGrid } from "lucide-react";
import TemplateCard, { type StoreTemplate } from "@/components/TemplateCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website Templates for Sale", description: "Premium website templates by Frosh CodeOrbit." };

export default async function StorePage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const db = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  const { data: items } = db
    ? await db.from("website_templates").select("id,title,slug,description,cover_image,price_kobo").eq("published", true).order("created_at", { ascending: false })
    : { data: [] };
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-28 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"><ArrowLeft size={16}/> Back to portfolio</Link>
        <div className="my-8 overflow-hidden rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10 lg:p-12">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[.17em] text-blue-700 dark:bg-blue-950 dark:text-blue-300"><LayoutGrid size={14}/> FroshCodeOrbit Marketplace</p>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl">Websites ready to make an impression.</h1>
              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">Explore professionally built, downloadable website templates. Browse the details and live preview before choosing the right starting point.</p>
            </div>
            <Link href="/store/recover" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><ShieldCheck size={17}/> Recover a purchase <ArrowRight size={16}/></Link>
          </div>
        </div>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Browse the collection</p><h2 className="text-2xl font-extrabold sm:text-3xl">All templates</h2></div>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900">{(items || []).length} available</span>
        </div>
        {(items || []).length > 0
          ? <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">{(items as StoreTemplate[]).map(item => <TemplateCard key={item.id} item={item}/>)}</div>
          : <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">No templates are published yet. Check back soon.</div>}
      </div>
    </main>
  );
}
