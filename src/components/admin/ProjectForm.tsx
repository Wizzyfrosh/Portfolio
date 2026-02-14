"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ProjectFormProps {
    initialData?: any; // If provided, we are editing
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        tech_stack: initialData?.tech_stack?.join(", ") || "",
        live_url: initialData?.live_url || "",
        github_url: initialData?.github_url || "",
        apk_url: initialData?.apk_url || "",
        published: initialData?.published || false,
    });

    const [screenshots, setScreenshots] = useState<string[]>(initialData?.screenshots || []);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null); // Clear error on change
    };

    const handleToggle = () => {
        setFormData((prev) => ({ ...prev, published: !prev.published }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: "screenshots" | "apks") => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        setError(null);
        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

            if (bucket === "screenshots") {
                setScreenshots((prev) => [...prev, data.publicUrl]);
            } else {
                setFormData((prev) => ({ ...prev, apk_url: data.publicUrl }));
            }
        } catch (error: any) {
            console.error("Error uploading file:", error);
            setError(error.message || "Error uploading file. Make sure storage buckets ('apks', 'screenshots') exist.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const projectData = {
            title: formData.title,
            description: formData.description,
            tech_stack: formData.tech_stack.split(",").map((s: string) => s.trim()).filter(Boolean),
            live_url: formData.live_url || null,
            github_url: formData.github_url || null,
            apk_url: formData.apk_url || null,
            published: formData.published,
            screenshots: screenshots,
        };

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("You must be logged in to save projects.");

            let result;
            if (initialData) {
                // Update
                result = await supabase
                    .from("projects")
                    .update(projectData)
                    .eq("id", initialData.id);
            } else {
                // Insert
                result = await supabase.from("projects").insert([projectData]);
            }

            if (result.error) throw result.error;

            router.push("/admin/dashboard");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving project:", error);
            setError(error.message || "Error saving project. Check your permissions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto space-y-8">

            {/* Basic Info */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Project Details</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
                        <input
                            type="text"
                            name="tech_stack"
                            value={formData.tech_stack}
                            onChange={handleChange}
                            placeholder="Next.js, Supabase, Tailwind"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                        <input
                            type="url"
                            name="live_url"
                            value={formData.live_url}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                        <input
                            type="url"
                            name="github_url"
                            value={formData.github_url}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Media Uploads */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Media & Files</h3>

                {/* Screenshots */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Screenshots</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        {screenshots.map((url, idx) => (
                            <div key={idx} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img src={url} alt="Screenshot" className="object-cover w-full h-full" />
                                <button
                                    type="button"
                                    onClick={() => setScreenshots(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg aspect-video cursor-pointer hover:border-blue-500 transition-colors">
                            <Upload className="text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Upload Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "screenshots")}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>

                {/* APK Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">APK File</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={formData.apk_url}
                            readOnly
                            className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                            placeholder="No APK uploaded"
                        />
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                            <Upload size={18} />
                            <span>Upload APK</span>
                            <input
                                type="file"
                                accept=".apk"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "apks")}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    {uploading && <p className="text-xs text-blue-600 mt-2">Uploading...</p>}
                </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4 border-t pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={handleToggle}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900">Publish Project</span>
                </label>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Saving...
                        </>
                    ) : (
                        "Save Project"
                    )}
                </button>
            </div>
        </form>
    );
}
