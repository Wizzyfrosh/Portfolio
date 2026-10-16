import Link from "next/link";
import ContentEngagement from "@/components/ContentEngagement";
import { ArrowUpRight, LayoutTemplate } from "lucide-react";

export type StoreTemplate = {
  id: string; slug: string; title: string; description: string | null;
  cover_image: string | null; price_kobo: number; product_type?: "template" | "ebook";
};

export default function TemplateCard({ item }: { item: StoreTemplate }) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_44px_-28px_rgba(15,23,42,.42)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-30px_rgba(15,23,42,.55)] dark:border-slate-700 dark:bg-slate-900">
      <Link href={`/store/${item.slug}`} aria-label={`View ${item.title}`} className="block overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="relative aspect-[16/10] overflow-hidden">
          {item.cover_image
            ? <img src={item.cover_image} alt={`${item.title} website preview`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.035]"/>
            : <div className="flex h-full items-center justify-center gap-3 text-slate-400"><LayoutTemplate size={30}/><span className="font-semibold">Digital product preview</span></div>}
          <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-700 shadow-sm">{item.product_type === "ebook" ? "Ebook / Study Material" : "Website Template"}</span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold leading-snug tracking-tight text-slate-900 dark:text-white">{item.title}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description || "A downloadable digital product ready for your next project."}</p>
        </div>
        <ContentEngagement type="template" id={item.id} sharePath={`/store/${item.slug}`} compact />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
          <div><p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">One-time price</p><p className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">₦{(item.price_kobo / 100).toLocaleString("en-NG")}</p></div>
          <Link href={`/store/${item.slug}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Details <ArrowUpRight size={16}/></Link>
        </div>
      </div>
    </article>
  );
}
