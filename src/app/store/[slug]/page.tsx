import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Download, ShieldCheck } from "lucide-react";
import BuyTemplateButton from "@/components/BuyTemplateButton";
import ContentEngagement from "@/components/ContentEngagement";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const origin = "https://www.froshcodeorbit.site";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { title: "Website Template", robots: { index: false } };
  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data } = await db.from("website_templates")
    .select("title,description,cover_image").eq("slug", slug).eq("published", true).maybeSingle();
  if (!data) return { title: "Template not found", robots: { index: false } };
  const canonical = `${origin}/store/${encodeURIComponent(slug)}`;
  const description = String(data.description || "Explore this website template by Frosh CodeOrbit.").slice(0, 160);
  const images = data.cover_image?.startsWith("https://") ? [data.cover_image] : [];
  return {
    title: data.title, description, alternates: { canonical },
    openGraph: { title: data.title, description, url: canonical, type: "website", ...(images.length ? { images } : {}) },
    twitter: { card: images.length ? "summary_large_image" : "summary", title: data.title, description, ...(images.length ? { images } : {}) },
  };
}

export default async function TemplateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) notFound();
  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data: item } = await db.from("website_templates")
    .select("id,title,description,cover_image,demo_url,price_kobo").eq("slug", slug).eq("published", true).maybeSingle();
  if (!item) notFound();
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-28 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"><ArrowLeft size={16}/> All templates</Link>
        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_-40px_rgba(15,23,42,.4)] dark:border-slate-800 dark:bg-slate-900">
          <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
            <div className="min-w-0 border-b border-slate-100 p-5 sm:p-8 lg:border-b-0 lg:border-r lg:border-slate-100 lg:p-10 dark:border-slate-800">
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 dark:bg-blue-950">Premium website template</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-500 dark:bg-slate-800 dark:text-slate-300">Digital download</span>
              </div>
              <h1 className="mb-6 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">{item.title}</h1>
              <div className="mb-6"><ContentEngagement type="template" id={item.id} sharePath={`/store/${slug}`}/></div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                {item.cover_image
                  ? <img src={item.cover_image} alt={`${item.title} website preview`} className="aspect-[16/10] w-full object-cover object-top"/>
                  : <div className="flex aspect-[16/10] items-center justify-center font-semibold text-slate-400">Website preview</div>}
              </div>
              <section className="mt-8 rounded-2xl bg-slate-50 p-5 sm:p-7 dark:bg-slate-800/60">
                <h2 className="mb-3 text-xl font-extrabold">About this template</h2>
                <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{item.description}</p>
              </section>
              {item.demo_url && <a className="mt-6 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950" target="_blank" rel="noopener noreferrer" href={item.demo_url}><ArrowUpRight size={18}/> Open live preview</a>}
            </div>
            <aside className="min-w-0 bg-slate-50/80 p-5 sm:p-8 lg:p-10 dark:bg-slate-900">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-700 dark:bg-slate-800 lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">One-time purchase</p>
                <p className="mt-2 text-4xl font-black tracking-tight">₦{(item.price_kobo / 100).toLocaleString("en-NG")}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Secure checkout using Paystack</p>
                <div className="my-6 border-t border-slate-100 dark:border-slate-700"/>
                <BuyTemplateButton id={item.id}/>
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <p className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-blue-600" size={19}/> Payment verified before your download is issued</p>
                  <p className="flex items-start gap-3"><Download className="mt-0.5 shrink-0 text-blue-600" size={19}/> Time-limited, private ZIP download</p>
                  <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-600" size={19}/> Recover your purchase using the original email</p>
                </div>
                <Link href="/store/recover" className="mt-6 block text-sm font-semibold text-blue-600 underline underline-offset-4">Already purchased? Recover your download</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
