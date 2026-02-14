"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SkillsBar from "./SkillsBar";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-28 pb-0 overflow-hidden bg-white">
            {/* Very subtle left-side blue gradient */}
            <div className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-blue-50/60 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-8 items-end">
                {/* Text Content - Left Side */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10 pb-16"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[3.2rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold text-gray-900 leading-[1.1] mb-4"
                    >
                        Hello!{" "}
                        <span className="text-blue-600">I&apos;m</span>
                        <br />
                        <span className="text-blue-600">Umanor Wisdom</span>
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl font-medium text-gray-600 mb-8"
                    >
                        Web &amp; Software Developer
                    </motion.h2>

                    <motion.ul
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3.5 mb-10"
                    >
                        {[
                            "Building robust web applications.",
                            "Creating responsive and efficient solutions.",
                            "Backend & frontend development."
                        ].map((text, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-600">
                                <div className="flex-shrink-0">
                                    <Check size={18} strokeWidth={3} className="text-emerald-500" />
                                </div>
                                <span className="font-medium text-[15px]">{text}</span>
                            </li>
                        ))}
                    </motion.ul>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <button className="px-7 py-3 bg-red-500 text-white font-bold text-sm rounded-md hover:bg-red-600 transition-all duration-300">
                            Let&apos;s Talk
                        </button>
                        <button className="px-6 py-3 border border-gray-300 text-gray-800 font-semibold text-sm rounded-md flex items-center gap-2 hover:border-gray-500 transition-all duration-300">
                            View Portfolio <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </motion.div>

                {/* Image Content - Right Side */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative flex flex-col items-center justify-end"
                >
                    {/* ===== Decorative Elements ===== */}

                    {/* Circle ring outline - top right */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="absolute -top-2 right-0 w-[70px] h-[70px] border-[3px] border-blue-400 rounded-full"
                    />

                    {/* Small purple/blue dot - near "I'm" text area */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                        className="absolute top-[18%] left-[30%] w-2 h-2 bg-purple-400 rounded-full"
                    />

                    {/* Blue dot - right side */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="absolute top-[40%] -right-2 w-3.5 h-3.5 bg-blue-500 rounded-full animate-float"
                    />

                    {/* Cyan/teal dot - lower right */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-[28%] -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-float-reverse"
                    />

                    {/* ===== Vibrant Animated Gradient Blobs ===== */}
                    {/* Blue-indigo blob - top left */}
                    <div
                        className="absolute -top-8 -left-10 w-64 h-64 rounded-full opacity-50 blur-3xl animate-blob-1 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                    />
                    {/* Pink-rose blob - bottom right */}
                    <div
                        className="absolute -bottom-12 -right-6 w-56 h-56 rounded-full opacity-45 blur-3xl animate-blob-2 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e)" }}
                    />
                    {/* Cyan-teal blob - top right */}
                    <div
                        className="absolute top-[5%] right-[-5%] w-48 h-48 rounded-full opacity-40 blur-3xl animate-blob-3 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, #06b6d4, #14b8a6)" }}
                    />
                    {/* Violet-purple blob - center-left */}
                    <div
                        className="absolute top-[35%] left-[-8%] w-52 h-52 rounded-full opacity-35 blur-3xl animate-blob-2 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)" }}
                    />

                    {/* "Hello" dark badge */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5, type: "spring" }}
                        className="absolute left-[5%] top-[52%] z-20"
                    >
                        <div className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg">
                            Available for work
                        </div>
                    </motion.div>

                    {/* Profile Image */}
                    <div className="relative w-full max-w-[400px]">
                        <img
                            src="/profile.png"
                            alt="Umanor Wisdom"
                            className="object-contain w-full h-auto relative z-10"
                        />
                    </div>

                    {/* Skills Bar - bottom of image */}
                    <div className="relative z-20 w-full max-w-[500px] -mt-5 mb-0">
                        <SkillsBar />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
