"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SkillsBar from "./SkillsBar";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 md:pt-28 pb-12 md:pb-0 px-4 md:px-0">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full md:w-[40%] h-full bg-gradient-to-b md:bg-gradient-to-r from-blue-50/60 to-transparent dark:from-blue-900/10 pointer-events-none" />

            <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center md:items-end">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:pb-16"
                >
                    <div className="space-y-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight"
                        >
                            Hi!{" "}
                            <span className="text-blue-600 dark:text-blue-400">I&apos;m</span>
                            <br />
                            <span className="text-blue-600 dark:text-blue-400">Umanor Wisdom</span>
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-2xl font-medium text-gray-600 dark:text-gray-300"
                        >
                            Web &amp; Software Developer
                        </motion.h2>
                    </div>

                    <motion.ul
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-4 inline-block"
                    >
                        {[
                            "Building robust web applications.",
                            "Creating responsive solutions.",
                            "Full-stack development expert."
                        ].map((text, i) => (
                            <li key={i} className="flex items-center justify-center md:justify-start gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} strokeWidth={3} className="text-emerald-500 flex-shrink-0" />
                                <span className="font-medium text-sm md:text-base">{text}</span>
                            </li>
                        ))}
                    </motion.ul>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    >
                        <a href="#contact" className="w-full sm:w-auto">
                            <button className="w-full px-8 py-3 bg-red-500 text-white font-bold text-sm rounded-md hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25">
                                Let&apos;s Talk
                            </button>
                        </a>
                        <a href="#projects" className="w-full sm:w-auto">
                            <button className="w-full px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-sm rounded-md flex items-center justify-center gap-2 hover:border-gray-500 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                                View Portfolio <ArrowRight size={16} />
                            </button>
                        </a>
                    </motion.div>
                </motion.div>

                {/* Image Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative flex flex-col items-center justify-center md:justify-end w-full"
                >
                    {/* Floating Decorative Elements - Responsive Positioning */}
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute top-0 right-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 border-[3px] border-blue-400 rounded-full opacity-40"
                        />
                        <div className="absolute top-[20%] left-[10%] md:left-[20%] w-2 h-2 bg-purple-400 rounded-full" />
                        <div className="absolute top-[40%] right-0 w-3 h-3 bg-blue-500 rounded-full animate-float" />
                        <div className="absolute bottom-[30%] left-0 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-float-reverse" />
                    </div>

                    {/* Profile Image Container */}
                    <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] max-h-[300px] md:max-h-none flex justify-center overflow-hidden md:overflow-visible">
                        <img
                            src="/profile.png"
                            alt="Umanor Wisdom"
                            className="object-contain w-full h-auto relative z-10 scale-110 md:scale-105 origin-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_50px_rgba(0,119,255,0.2)]"
                        />

                        {/* Status Badge */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5, type: "spring" }}
                            className="absolute left-0 sm:left-4 top-1/2 md:top-[52%] z-20"
                        >
                            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold shadow-2xl border border-white/10">
                                Available for work
                            </div>
                        </motion.div>
                    </div>

                    {/* Skills Bar - Wider than image on desktop */}
                    <div className="relative z-20 w-full max-w-[340px] sm:max-w-[400px] md:max-w-[500px] -mt-4 md:-mt-6">
                        <SkillsBar />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
