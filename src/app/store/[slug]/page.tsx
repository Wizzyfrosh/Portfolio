import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import BuyTemplateButton from "@/components/BuyTemplateButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Shared links continue to work, opening a checkout-focused page instead of a details page.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const origin = "https://www.froshcodeorbit.site";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { title: "Digital Product", robots: { index: false } };
  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data } = await db.from("website_templates")
    .select("title,description,cover_image,product_type").eq("slug", slug).eq("published", true).maybeSingle();
  if (!data) return { title: "Product unavailable", robots: { index: false } };
  const canonical = `${origin}/store/${encodeURIComponent(slug)}`;
  const description = String(data.description || "Get a digital product from Frosh CodeOrbit.").slice(0, 160);
  const images = data.cover_image?.startsWith("https://") ? [data.cover_image] : [];
  return { title: `Get ${data.title}`, description, alternates: { canonical },
    openGraph: { title: data.title, description, url: canonical, type: "website", ...(images.length ? { images } : {}) },
    twitter: { card: images.length ? "summary_large_image" : "summary", title: data.title, description, ...(images.length ? { images } : {}) },
  };
}

export default async function ProductCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) notFound();
  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data: item } = await db.from("website_templates")
    .select("id,title,cover_image,price_kobo,product_type").eq("slug", slug).eq("published", true).maybeSingle();
  if (!item) notFound();
  const productName = item.product_type === "ebook" ? "Ebook" : "Template";
  return <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-28 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 md:pt-36">
    <div className="mx-auto max-w-lg">
      <Link href="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"><ArrowLeft size={16}/> Back to marketplace</Link>
      <section className="mt-6 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-600">Secure checkout</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Get {productName}</h1>
          <div className="mt-5 flex items-center gap-4">
            {item.cover_image && <img src={item.cover_image} alt="" className="h-20 w-24 shrink-0 rounded-xl bg-slate-100 object-cover object-top"/>}
            <div className="min-w-0"><p className="break-words font-bold text-slate-800 dark:text-white">{item.title}</p>
              <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">₦{(item.price_kobo/100).toLocaleString("en-NG")}</p>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <BuyTemplateButton id={item.id} buttonLabel="Proceed to Paystack" />
          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={16} className="shrink-0 text-blue-600"/> The amount is verified on our server before Paystack checkout. Downloads are available after payment confirmation.</p>
        </div>
      </section>
    </div>
  </main>;
}
