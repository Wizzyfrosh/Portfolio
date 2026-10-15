import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import TemplateCard, { type StoreTemplate } from "@/components/TemplateCard";

export default async function FeaturedTemplates() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("website_templates")
    .select("id,slug,title,description,cover_image,price_kobo")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);
  if (error || !data?.length) return null;

  return (
    <section id="templates" className="bg-white py-20 dark:bg-gray-900 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.17em] text-blue-600"><Sparkles size={16}/> Website marketplace</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Templates ready for your next big idea.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">Browse a selection of ready-made websites, explore the previews and pick your next starting point.</p>
          </div>
          <Link href="/store" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-white">Explore all templates <ArrowRight size={17}/></Link>
        </div>
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data as StoreTemplate[]).map(item => <TemplateCard key={item.id} item={item}/>)}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/store" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">View full catalogue <ArrowRight size={16}/></Link>
        </div>
      </div>
    </section>
  );
}
