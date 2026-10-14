"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

type Template = {
  id?: string; title: string; slug: string; description: string;
  cover_image: string | null; demo_url: string | null;
  price_kobo: number; file_path: string; published: boolean;
};

export default function TemplateForm({ initialData }: { initialData?: Template }) {
  const router = useRouter();
  const [data, setData] = useState<Template>(initialData || {
    title: "", slug: "", description: "", cover_image: null,
    demo_url: null, price_kobo: 5000000, file_path: "", published: false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [priceNaira, setPriceNaira] = useState(String((data.price_kobo || 0) / 100));

  async function upload(file: File, type: "image" | "zip") {
    if (!supabase) return setError("Database is not configured.");
    if (type === "zip" && !file.name.toLowerCase().endsWith(".zip")) return setError("Upload a ZIP archive.");
    if (type === "image" && (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) return setError("Use an image under 5 MB.");
    if (type === "zip" && file.size > 50 * 1024 * 1024) return setError("ZIP must be below 50 MB.");
    setUploading(true); setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in again.");
      const bucket = type === "zip" ? "template-files" : "screenshots";
      const path = `templates/${crypto.randomUUID()}.${type === "zip" ? "zip" : file.name.split(".").pop()?.toLowerCase() || "png"}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;
      if (type === "zip") setData(prev => ({ ...prev, file_path: path }));
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
    if (!data.file_path) return setError("Upload a template ZIP file.");
    setSaving(true); setError("");
    const payload = {
      title: data.title.trim(), slug: data.slug.trim().toLowerCase(),
      description: data.description.trim(), cover_image: data.cover_image,
      demo_url: data.demo_url || null, price_kobo: Math.round(price * 100),
      file_path: data.file_path, published: data.published,
    };
    try {
      const result = initialData?.id
        ? await supabase.from("website_templates").update(payload).eq("id", initialData.id)
        : await supabase.from("website_templates").insert(payload);
      if (result.error) throw result.error;
      router.push("/admin/templates"); router.refresh();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6 text-gray-900">
      <h2 className="text-2xl font-bold">{initialData?.id ? "Edit" : "Add"} Website Template</h2>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      <label className="block text-sm font-semibold">Template Name
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
      <label className="block text-sm font-semibold">Live Demo URL (Optional)
        <input type="url" value={data.demo_url || ""} onChange={e => setData(d => ({ ...d, demo_url: e.target.value }))} className="mt-2 w-full rounded-lg border p-3" />
      </label>
      <label className="block text-sm font-semibold">Cover Image
        <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) void upload(f, "image"); }} className="mt-2 block w-full" />
        {data.cover_image && <span className="mt-2 block text-green-700">Cover image uploaded</span>}
      </label>
      <label className="block text-sm font-semibold">Template ZIP (Private)
        <input type="file" accept=".zip,application/zip" disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) void upload(f, "zip"); }} className="mt-2 block w-full" />
        {data.file_path && <span className="mt-2 block text-green-700">ZIP uploaded</span>}
      </label>
      <label className="flex items-center gap-2 font-semibold">
        <input type="checkbox" checked={data.published} onChange={e => setData(d => ({ ...d, published: e.target.checked }))} />
        Publish template for sale
      </label>
      <p className="text-xs text-gray-500">Publish only templates you own and are licensed to sell. Payments require backend setup before activation.</p>
      <button disabled={saving || uploading} className="rounded-full bg-blue-600 px-7 py-3 font-bold text-white disabled:opacity-50">
        {uploading ? "Uploading..." : saving ? "Saving..." : "Save Template"}
      </button>
    </form>
  );
}
