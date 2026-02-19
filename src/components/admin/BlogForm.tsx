"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { Upload, X, Loader2, Save } from "lucide-react";

interface BlogFormProps {
    initialData?: any;
}

export default function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        cover_image: initialData?.cover_image || "",
        published: initialData?.published || false,
    });

    const sanitizeSlug = (val: string) => {
        return val
            .toLowerCase()
            .replace(/[^\w\s-]/g, "") // Remove all non-word chars (except spacing and hyphens)
            .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with a single hyphen
            .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "slug") {
            setFormData((prev) => ({ ...prev, [name]: sanitizeSlug(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        setError(null);

        // Auto-generate slug from title if slug is empty (only on create)
        if (name === "title" && !initialData) {
            setFormData((prev) => ({
                ...prev,
                slug: sanitizeSlug(value),
            }));
        }
    };


    const handleToggle = () => {
        setFormData((prev) => ({ ...prev, published: !prev.published }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        setError(null);
        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `blog_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            if (!supabase) throw new Error("Supabase client is not initialized.");
            const { error: uploadError } = await supabase.storage.from("blog-images").upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
            setFormData((prev) => ({ ...prev, cover_image: data.publicUrl }));
        } catch (error: any) {
            console.error("Error uploading image:", error);
            setError(error.message || "Error uploading image. Check 'blog-images' bucket.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!supabase) throw new Error("Supabase client is not initialized.");
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");

            let result;
            if (initialData) {
                result = await supabase
                    .from("blogs")
                    .update(formData)
                    .eq("id", initialData.id);
            } else {
                result = await supabase.from("blogs").insert([formData]);
            }

            if (result.error) throw result.error;

            router.push("/admin/blog");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving blog:", error);
            setError(error.message || "Error saving blog.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-xl shadow-sm max-w-4xl mx-auto space-y-8">
            {error && (
                <div className="p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                            required
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
                        <div className="flex items-center gap-4">
                            {formData.cover_image && (
                                <div className="h-12 w-20 relative rounded overflow-hidden bg-gray-100">
                                    <img src={formData.cover_image} alt="Cover" className="object-cover w-full h-full" />
                                </div>
                            )}
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                <span className="text-sm">{uploading ? "Uploading..." : "Upload Cover"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-800 dark:text-white"
                        placeholder="Short summary for the card..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm dark:bg-gray-800 dark:text-white"
                        placeholder="# Blog Title..."
                        required
                    />
                </div>

                <div className="flex items-center gap-2 border-t dark:border-gray-800 pt-6">
                    <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={handleToggle}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">Publish Post</span>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="rotate-0 transition-transform px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Post
                    </button>
                </div>
            </div>
        </form>
    );
}
