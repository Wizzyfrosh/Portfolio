"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";

export default function Blog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("blogs")
                .select("*")
                .eq("published", true)
                .order("created_at", { ascending: false })
                .limit(3);

            if (data) setPosts(data);
            setLoading(false);
        };

        fetchPosts();
    }, []);

    return (
        <section id="blog" className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                            LATEST FROM BLOG
                        </h2>
                        <div className="hidden md:block w-20 h-[1px] bg-gray-300 dark:bg-gray-700" />
                    </div>
                    {/* Placeholder for View All */}
                    {/* <button className="hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all">
                        View All Posts <ArrowRight size={18} />
                    </button> */}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg">Broadcasting thoughts directly from the code mines soon.</p>
                        <p className="text-sm mt-2">Check back later for updates!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                            >
                                {/* Cover Image? Optional */}
                                {post.cover_image && (
                                    <div className="mb-6 rounded-lg overflow-hidden h-40 bg-gray-100 dark:bg-gray-700">
                                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}

                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                                        <Calendar size={14} />
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </div>
                                    <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read <ArrowRight size={14} />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
