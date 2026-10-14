import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website Templates for Sale", description: "Premium website templates by Frosh CodeOrbit." };

export default async function StorePage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const db = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  const { data: items } = db
    ? await db.from("website_templates").select("id,title,slug,description,cover_image,price_kobo").eq("published", true).order("created_at", { ascending: false })
    : { data: [] };
  return <main className="min-h-screen bg-gray-50 px-6 py-16 text-gray-900 dark:bg-gray-950 dark:text-white">
    <div className="mx-auto max-w-6xl">
      <Link href="/" className="font-semibold text-blue-600">← Back to Portfolio</Link>
      <div className="my-12"><h1 className="text-4xl font-extrabold">Website Templates</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-300">Explore ready-made website templates available for purchase.</p></div>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {(items || []).map(item => <article key={item.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {item.cover_image && <img src={item.cover_image} alt={item.title} className="aspect-video w-full object-cover" />}
          <div className="space-y-3 p-6">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="line-clamp-3 text-sm text-gray-500 dark:text-gray-300">{item.description}</p>
            <p className="text-2xl font-extrabold text-blue-600">₦{(item.price_kobo / 100).toLocaleString("en-NG")}</p>
            <Link href={`/store/${item.slug}`} className="inline-block rounded-full bg-blue-600 px-5 py-2 font-semibold text-white">View Template</Link>
          </div>
        </article>)}
      </div>
      {!items?.length && <p className="rounded-xl border p-10 text-center text-gray-500">No templates listed yet. Check back soon.</p>}
    </div>
  </main>;
}
