import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import BuyTemplateButton from "@/components/BuyTemplateButton";

export const dynamic = "force-dynamic";

export default async function TemplateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) notFound();
  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data: item } = await db.from("website_templates")
    .select("id,title,description,cover_image,demo_url,price_kobo").eq("slug", slug).eq("published", true).maybeSingle();
  if (!item) notFound();
  return <main className="min-h-screen bg-gray-50 px-6 py-16 text-gray-900 dark:bg-gray-950 dark:text-white">
    <div className="mx-auto max-w-5xl">
      <Link href="/store" className="font-semibold text-blue-600">← All Templates</Link>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          {item.cover_image ? <img src={item.cover_image} alt={item.title} className="w-full rounded-2xl border object-cover" /> : <div className="aspect-video rounded-2xl bg-gray-200" />}
          <h1 className="text-4xl font-extrabold">{item.title}</h1>
          <p className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-300">{item.description}</p>
          {item.demo_url && <a className="inline-block font-semibold text-blue-600 underline" target="_blank" rel="noopener noreferrer" href={item.demo_url}>Preview Live Demo ↗</a>}
        </div>
        <aside className="h-fit space-y-6 rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-500">One-time payment</p>
          <p className="text-4xl font-extrabold">₦{(item.price_kobo / 100).toLocaleString("en-NG")}</p>
          <BuyTemplateButton id={item.id} />
          <Link href="/store/recover" className="block text-sm font-semibold text-blue-600 underline">Already purchased? Recover download</Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">After successful verification, you'll receive a short-lived secure download link.</p>
        </aside>
      </div>
    </div>
  </main>;
}
