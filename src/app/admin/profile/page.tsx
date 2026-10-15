"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Upload, Loader2, Save, CheckCircle } from "lucide-react";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [profile, setProfile] = useState<any>({
        id: null,
        resume_url: "",
        hero_image_url: "",
        bio: "",
        email: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();

            if (error) throw error;

            if (data) {
                setProfile(data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        if (!supabase) {
            setMessage({ type: "error", text: "Supabase client not initialized" });
            return;
        }

        setMessage(null);
        const file = e.target.files[0];
        if (!file.name.toLowerCase().endsWith(".pdf") || file.size > 10 * 1024 * 1024) {
            setMessage({ type: "error", text: "Please choose a PDF no larger than 10 MB." });
            return;
        }
        setUploadingResume(true);
        const fileExt = "pdf";
        const fileName = `resume_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Log in before uploading.");
            const { error: uploadError } = await supabase.storage.from("profile").upload(filePath, file, { contentType: "application/pdf" });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("profile").getPublicUrl(filePath);

            const { data: existing, error: readError } = await supabase.from("profiles").select("id").limit(1).maybeSingle();
            if (readError) throw readError;
            const saved = existing?.id
                ? await supabase.from("profiles").update({ resume_url: data.publicUrl }).eq("id", existing.id).select().single()
                : await supabase.from("profiles").insert({ resume_url: data.publicUrl }).select().single();
            if (saved.error) throw saved.error;
            setProfile((prev: any) => ({ ...prev, ...saved.data }));
            setMessage({ type: "success", text: "Resume uploaded and saved successfully." });
        } catch (error: any) {
            console.error("Error uploading resume:", error);
            setMessage({ type: "error", text: error.message || "Error uploading resume. Check 'profile' bucket." });
        } finally {
            setUploadingResume(false);
        }
    };

    const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !supabase) return;
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setMessage({ type: "error", text: "Choose a PNG, JPG or WebP image under 5 MB." });
            return;
        }
        setUploadingHero(true); setMessage(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Sign in to change your hero photo.");
            const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
            const path = `hero/${crypto.randomUUID()}.${ext}`;
            const uploaded = await supabase.storage.from("profile").upload(path, file, { contentType: file.type, upsert: false });
            if (uploaded.error) throw uploaded.error;
            const url = supabase.storage.from("profile").getPublicUrl(path).data.publicUrl;
            const { data: existing, error: readError } = await supabase.from("profiles").select("id").limit(1).maybeSingle();
            if (readError) throw readError;
            const saved = existing?.id
                ? await supabase.from("profiles").update({ hero_image_url: url }).eq("id", existing.id).select().single()
                : await supabase.from("profiles").insert({ hero_image_url: url }).select().single();
            if (saved.error) throw saved.error;
            setProfile((prev: any) => ({ ...prev, ...saved.data }));
            setMessage({ type: "success", text: "Hero photo saved. The homepage will display your new photo without changing its layout." });
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Hero upload failed." });
        } finally { setUploadingHero(false); e.target.value = ""; }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setMessage({ type: "error", text: "Supabase client not initialized" });
            return;
        }
        setSaving(true);
        setMessage(null);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");

            let result;
            if (profile.id) {
                result = await supabase
                    .from("profiles")
                    .update({
                        resume_url: profile.resume_url,
                        hero_image_url: profile.hero_image_url,
                        bio: profile.bio,
                        email: profile.email,
                    })
                    .eq("id", profile.id);
            } else {
                result = await supabase.from("profiles").insert([
                    {
                        resume_url: profile.resume_url,
                        hero_image_url: profile.hero_image_url,
                        bio: profile.bio,
                        email: profile.email,
                    },
                ]);
            }

            if (result.error) throw result.error;

            setMessage({ type: "success", text: "Profile updated successfully!" });
            if (!profile.id) fetchProfile();
        } catch (error: any) {
            console.error("Error saving profile:", error);
            setMessage({ type: "error", text: error.message || "Error saving profile." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Profile & Resume</h1>

            <form
                onSubmit={handleSave}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-xl shadow-sm space-y-8"
            >
                {message && (
                    <div
                        className={`p-4 rounded-lg flex items-center gap-3 ${message.type === "success"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                    >
                        {message.type === "success" ? <CheckCircle size={20} /> : <span aria-hidden="true">!</span>}
                        {message.text}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Homepage hero photo</h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Only the photo changes. The existing hero layout, decoration, positioning, and animations stay as they are.</p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <img src={profile.hero_image_url || "/profile.png"} alt="Current hero photo" className="h-40 w-36 rounded-xl border bg-white object-contain" />
                            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
                                <Upload size={18}/>{uploadingHero ? "Uploading..." : "Replace hero photo"}
                                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleHeroUpload} disabled={uploadingHero}/>
                            </label>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume</h3>
                        <div className="flex items-center gap-6 p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex-1">
                                {profile.resume_url ? (
                                    <div className="flex items-center gap-3 text-green-600 dark:text-green-400 mb-2">
                                        <CheckCircle size={18} />
                                        <span className="font-medium">Resume Uploaded</span>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 mb-2">No resume uploaded yet.</p>
                                )}
                                <div className="text-sm text-gray-500 dark:text-gray-400 break-all">{profile.resume_url}</div>
                            </div>

                            <label className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                                {uploadingResume ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                <span>{uploadingResume ? "Uploading..." : "Upload PDF"}</span>
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={uploadingResume}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="border-t dark:border-gray-800 pt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Public Email</label>
                        <input
                            type="email"
                            value={profile.email || ""}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                            placeholder="hello@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Short Bio</label>
                        <textarea
                            value={profile.bio || ""}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-800 dark:text-white"
                            placeholder="A brief introduction about yourself..."
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving || uploadingResume}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
