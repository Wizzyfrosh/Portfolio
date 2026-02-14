"use client";

import { motion } from "framer-motion";
import { Download, GraduationCap, Briefcase, Award, Code2, Database, Globe, Layers } from "lucide-react";

const highlights = [
    {
        icon: Code2,
        title: "Frontend Development",
        description: "React, Next.js, TypeScript, Tailwind CSS",
        color: "from-blue-500 to-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Database,
        title: "Backend Development",
        description: "Node.js, Python, PostgreSQL, REST APIs",
        color: "from-emerald-500 to-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        icon: Globe,
        title: "Full Stack Applications",
        description: "MERN Stack, Supabase, Cloud Deployment",
        color: "from-purple-500 to-purple-600",
        bg: "bg-purple-50",
    },
    {
        icon: Layers,
        title: "Software Architecture",
        description: "Scalable systems, clean code, CI/CD",
        color: "from-amber-500 to-amber-600",
        bg: "bg-amber-50",
    },
];

const education = [
    {
        degree: "Bachelor of Science in Computer Science",
        institution: "University",
        year: "2020 - 2024",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ResumeSection() {
    return (
        <section id="resume" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-center gap-4 mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight whitespace-nowrap">
                        RESUME
                    </h2>
                    <div className="flex-grow h-[1px] bg-gray-200" />
                </div>

                {/* Download CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-12"
                >
                    <div className="mb-4 sm:mb-0">
                        <h3 className="text-xl font-bold text-white mb-1">Download My Resume</h3>
                        <p className="text-gray-400 text-sm">Get a copy of my full resume in PDF format</p>
                    </div>
                    <a
                        href="/resume.pdf"
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    >
                        <Download size={18} />
                        Download PDF
                    </a>
                </motion.div>

                {/* Skills Highlights */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
                >
                    {highlights.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <div className={`bg-gradient-to-br ${item.color} rounded-lg w-8 h-8 flex items-center justify-center`}>
                                        <IconComponent size={18} className="text-white" />
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Education */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <GraduationCap size={20} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Education</h3>
                    </div>
                    {education.map((edu, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                                <p className="text-gray-500 text-sm">{edu.institution} • {edu.year}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
