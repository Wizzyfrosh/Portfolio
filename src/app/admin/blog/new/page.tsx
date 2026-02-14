"use client";

import BlogForm from "@/components/admin/BlogForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBlogPage() {
    return (
        <div>
            <div className="mb-6">
                <Link href="/admin/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={18} />
                    Back to Blogs
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Post</h1>
            </div>
            <BlogForm />
        </div>
    );
}
