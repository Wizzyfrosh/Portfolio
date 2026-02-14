"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Upload, Loader2, Save, CheckCircle } from "lucide-react";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [profile, setProfile] = useState<any>({
        id: null,
        resume_url: "",
        bio: "",
        email: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
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

        setUploadingResume(true);
        setMessage(null);
        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `resume_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage.from("profile").upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("profile").getPublicUrl(filePath);

            setProfile((prev: any) => ({ ...prev, resume_url: data.publicUrl }));
            setMessage({ type: "success", text: "Resume uploaded! Don't forget to save changes." });
        } catch (error: any) {
            console.error("Error uploading resume:", error);
            setMessage({ type: "error", text: error.message || "Error uploading resume. Check 'profile' bucket." });
        } finally {
            setUploadingResume(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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
                        bio: profile.bio,
                        email: profile.email,
                    })
                    .eq("id", profile.id);
            } else {
                result = await supabase.from("profiles").insert([
                    {
                        resume_url: profile.resume_url,
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
                        {message.type === "success" ? <CheckCircle size={20} /> : <Loader2 size={20} className="animate-spin" />}
                        {message.text}
                    </div>
                )}

                <div className="space-y-6">
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
                                    accept=".pdf"
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
