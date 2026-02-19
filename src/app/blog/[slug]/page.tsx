import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";

export const revalidate = 0;

interface BlogPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
    const { slug } = await params;
    console.log("BlogDetailPage: received slug:", slug);


    if (!supabase) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Service Unavailable</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Database connection is not available.</p>
                </div>
            </div>
        );
    }

    const { data: post, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/#blog"
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-6 max-w-4xl py-12 md:py-20">
                    <Link
                        href="/#blog"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                        {/* You could add author info here if available in schema */}
                        {/* <div className="flex items-center gap-2">
                            <User size={16} />
                            Wizzyfrosh
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="container mx-auto px-6 max-w-4xl py-12 md:py-16">
                {post.cover_image && (
                    <div className="mb-12 rounded-3xl overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800 shadow-xl">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
                    {/* If we had react-markdown, we'd use it here. 
                        Since we don't, we'll render as raw text with whitespace preserved for now.
                        The user can add react-markdown later if they want full formatting. */}
                    <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        {post.content}
                    </div>
                </div>

                {/* Footer Section / Share */}
                <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="text-gray-400 dark:text-gray-500 text-sm italic">
                        Thanks for reading!
                    </div>
                    <button
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium text-sm"
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied to clipboard!");
                            }
                        }}
                    >
                        <Share2 size={16} />
                        Share Post
                    </button>
                </div>
            </article>

            {/* Pagination / Recommends could go here */}
        </div>
    );
}
