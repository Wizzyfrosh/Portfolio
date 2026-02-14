"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const experienceItems = [
    { role: "Lead Web Developer", period: "2020 - 2022" },
    { role: "Full Stack Developer", period: "2022 - 2026" },
    { role: "Backend Developer", period: "2022 - 2026" },
];

export default function ExperienceSection() {
    return (
        <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-2 gap-20">

                {/* Experience List */}
                <div>
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">EXPERIENCE</h2>
                        <div className="flex-grow h-[1px] bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="space-y-4">
                        {experienceItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-6 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group cursor-pointer"
                            >
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item.role}</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">{item.period}</span>
                                    <ArrowUpRight size={20} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Case Study */}
                <div>
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">CASE STUDY</h2>
                        <div className="flex-grow h-[1px] bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="bg-white dark:bg-gray-950">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Real-time Chat Application with Node.js
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Built a real-time chat application for a startup using Node.js and Socket.io that supports live messaging with multiple users.
                        </p>
                        <button className="px-8 py-3 bg-[#1457a4] text-white font-bold rounded-full mb-10 hover:bg-blue-800 transition-all">
                            View Details
                        </button>

                        <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
                            <img
                                src="https://placehold.co/800x500/png?text=Case+Study+App+UI"
                                alt="Case Study"
                                className="w-full object-cover"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
