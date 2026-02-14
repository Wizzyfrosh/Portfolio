"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import BlogForm from "@/components/admin/BlogForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditBlogPage() {
    const { id } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            const { data, error } = await supabase
                .from("blogs")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching blog:", error);
                router.push("/admin/blog");
            } else {
                setBlog(data);
            }
            setLoading(false);
        };

        if (id) fetchBlog();
    }, [id, router]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    if (!blog) return <div>Blog not found</div>;

    return (
        <div>
            <div className="mb-6">
                <Link href="/admin/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={18} />
                    Back to Blogs
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Post</h1>
            </div>
            <BlogForm initialData={blog} />
        </div>
    );
}
