"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

type Template = { id: string; title: string; slug: string; price_kobo: number; published: boolean; product_type?: "template" | "ebook" };

export default function AdminTemplates() {
  const [items, setItems] = useState<Template[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!supabase) return;
    supabase.from("website_templates").select("id,title,slug,price_kobo,published,product_type")
      .order("created_at", { ascending: false }).then(({ data, error }: { data: Template[] | null; error: { message: string } | null }) => {
        if (error) setError(error.message);
        else setItems(data || []);
      });
  }, []);
  return <div className="space-y-6 text-gray-900">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold dark:text-white">Digital Products for Sale</h1><p className="text-gray-500">Sell downloadable website templates (ZIP), ebooks and study materials (PDF).</p></div>
      <Link href="/admin/templates/new" className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white">Add Product</Link>
    </div>
    {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
    <div className="space-y-3">
      {items.map(item => <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border bg-white p-5">
        <div><p className="font-bold">{item.title}</p><p className="text-xs font-medium text-blue-600">{item.product_type === "ebook" ? "Ebook / PDF" : "Website Template / ZIP"}</p><p className="text-sm text-gray-500">₦{(item.price_kobo / 100).toLocaleString("en-NG")} · {item.published ? "Published" : "Draft"}</p></div>
        <Link href={`/admin/templates/${item.id}/edit`} className="font-semibold text-blue-600">Edit</Link>
      </div>)}
      {!items.length && !error && <p className="text-gray-500">No products yet. Add your first one.</p>}
    </div>
  </div>;
}
