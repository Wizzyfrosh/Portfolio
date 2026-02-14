"use client";

import { motion } from "framer-motion";

export default function About() {
    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">About Me</h2>
                    <p className="text-xl text-gray-700 leading-relaxed mb-6">
                        I am a passionate <span className="font-semibold text-blue-600">Web & Software Developer</span> with a focus on building
                        scalable, efficient, and user-friendly applications. With a strong foundation in both frontend and backend technologies,
                        I bridge the gap between design and engineering.
                    </p>
                    <p className="text-lg text-gray-600">
                        My journey involves working with modern stacks like Next.js, Supabase, and PostgreSQL to deliver high-performance solutions.
                        I love solving complex problems and turning coffee into clean code.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
