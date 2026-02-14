"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";
import { PlusCircle, Edit2, Trash2, Eye } from "lucide-react";

export default function BlogListPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error(error);
        else setBlogs(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (error) {
            alert("Error deleting blog");
        } else {
            setBlogs(blogs.filter((blog) => blog.id !== id));
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Blog Posts</h1>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle size={20} />
                    New Post
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {blogs.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No blog posts found. Create one to get started!
                                </td>
                            </tr>
                        ) : (
                            blogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{blog.title}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{blog.excerpt}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                                            {blog.published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/blog/${blog.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                <Edit2 size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(blog.id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
