"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

type Template = {
  id?: string; title: string; slug: string; description: string;
  cover_image: string | null; demo_url: string | null;
  price_kobo: number; file_path: string; published: boolean; product_type: "template" | "ebook";
};

export default function TemplateForm({ initialData }: { initialData?: Template }) {
  const router = useRouter();
  const [data, setData] = useState<Template>(initialData || {
    title: "", slug: "", description: "", cover_image: null,
    demo_url: null, price_kobo: 5000000, file_path: "", published: false, product_type: "template",
  });
  const productType = data.product_type || "template";
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [priceNaira, setPriceNaira] = useState(String((data.price_kobo || 0) / 100));

  async function upload(file: File, type: "image" | "product") {
    if (!supabase) return setError("Database is not configured.");
    if (type === "product" && productType === "template" && !file.name.toLowerCase().endsWith(".zip")) return setError("A website template requires a ZIP archive.");
    if (type === "product" && productType === "ebook" && (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf"))) return setError("An ebook or study material requires a PDF file.");
    if (type === "image" && (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) return setError("Use an image under 5 MB.");
    if (type === "product" && file.size > 50 * 1024 * 1024) return setError("Digital files must be below 50 MB.");
    setUploading(true); setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in again.");
      const bucket = type === "product" ? "template-files" : "screenshots";
      const extension = type === "product" ? (productType === "ebook" ? "pdf" : "zip") : (file.name.split(".").pop()?.toLowerCase() || "png");
      const path = `products/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: type === "product" ? (productType === "ebook" ? "application/pdf" : "application/zip") : file.type });
      if (uploadError) throw uploadError;
      if (type === "product") setData(prev => ({ ...prev, file_path: path }));
      else {
        const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
        setData(prev => ({ ...prev, cover_image: publicUrl.publicUrl }));
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setUploading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return setError("Database is unavailable.");
    const price = Number(priceNaira);
    if (!Number.isFinite(price) || price < 1 || Math.round(price * 100) !== price * 100) {
      return setError("Enter a valid price in NGN.");
    }
    if (!data.file_path) return setError(`Upload a ${productType === "ebook" ? "PDF ebook" : "ZIP template"} first.`);
    if (!data.file_path.toLowerCase().endsWith(productType === "ebook" ? ".pdf" : ".zip")) return setError(`Replace the download with a ${productType === "ebook" ? "PDF" : "ZIP"} file before saving.`);
    setSaving(true); setError("");
    const payload = {
      title: data.title.trim(), slug: data.slug.trim().toLowerCase(),
      description: data.description.trim(), cover_image: data.cover_image,
      demo_url: data.demo_url || null, price_kobo: Math.round(price * 100),
      file_path: data.file_path, published: data.published, product_type: productType,
    };
    try {
      const result = initialData?.id
        ? await supabase.from("website_templates").update(payload).eq("id", initialData.id).select("id,price_kobo").single()
        : await supabase.from("website_templates").insert(payload).select("id,price_kobo").single();
      if (result.error) throw result.error;
      if (result.data?.price_kobo !== payload.price_kobo) throw new Error("Saved price did not match. Please reload and try again.");
      router.push("/admin/templates"); router.refresh();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6 text-gray-900">
      <h2 className="text-2xl font-bold">{initialData?.id ? "Edit" : "Add"} Digital Product</h2>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      <label className="block text-sm font-semibold">Product Type
        <select value={productType} onChange={e => { const next = e.target.value as "template" | "ebook"; setData(current => ({ ...current, product_type: next, file_path: next === current.product_type ? current.file_path : "" })); }} className="mt-2 w-full rounded-lg border p-3">
          <option value="template">Website Template (ZIP)</option>
          <option value="ebook">Ebook / Study Material (PDF)</option>
        </select>
      </label>
      <label className="block text-sm font-semibold">Product Name
        <input required maxLength={150} value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value, slug: !initialData?.id ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : d.slug }))} className="mt-2 w-full rounded-lg border p-3" />
      </label>
      <label className="block text-sm font-semibold">URL Slug
        <input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={data.slug} onChange={e => setData(d => ({ ...d, slug: e.target.value }))} className="mt-2 w-full rounded-lg border p-3" />
      </label>
      <label className="block text-sm font-semibold">Description
        <textarea required rows={5} value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} className="mt-2 w-full rounded-lg border p-3" />
      </label>
      <label className="block text-sm font-semibold">Price (NGN)
        <input type="number" required min={1} step="0.01" value={priceNaira} onChange={e => setPriceNaira(e.target.value)} className="mt-2 w-full rounded-lg border p-3" />
      </label>
      {productType === "template" && <label className="block text-sm font-semibold">Live Demo URL (Optional)
        <input type="url" value={data.demo_url || ""} onChange={e => setData(d => ({ ...d, demo_url: e.target.value }))} className="mt-2 w-full rounded-lg border p-3" />
      </label>}
      <label className="block text-sm font-semibold">Cover Image
        <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) void upload(f, "image"); }} className="mt-2 block w-full" />
        {data.cover_image && <span className="mt-2 block text-green-700">Cover image uploaded</span>}
      </label>
      <label className="block text-sm font-semibold">{productType === "ebook" ? "Ebook / Study Material PDF" : "Website Template ZIP"} (Private)
        <input key={productType} type="file" accept={productType === "ebook" ? ".pdf,application/pdf" : ".zip,application/zip"} disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) void upload(f, "product"); }} className="mt-2 block w-full" />
        {data.file_path && <span className="mt-2 block text-green-700">Private {productType === "ebook" ? "PDF" : "ZIP"} uploaded</span>}
      </label>
      <label className="flex items-center gap-2 font-semibold">
        <input type="checkbox" checked={data.published} onChange={e => setData(d => ({ ...d, published: e.target.checked }))} />
        Publish product for sale
      </label>
      <p className="text-xs text-gray-500">Only sell files you own or have distribution rights to. Downloads are issued privately after verified payment.</p>
      <button disabled={saving || uploading} className="rounded-full bg-blue-600 px-7 py-3 font-bold text-white disabled:opacity-50">
        {uploading ? "Uploading..." : saving ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
