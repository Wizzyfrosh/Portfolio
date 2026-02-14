"use client";

import { motion } from "framer-motion";
import { Download, GraduationCap, Code2, Database, Globe, Layers, ArrowLeft, Briefcase, Award, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

const highlights = [
    {
        icon: Code2,
        title: "Frontend Development",
        description: "React, Next.js, TypeScript, Tailwind CSS",
        color: "from-blue-500 to-blue-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
        icon: Database,
        title: "Backend Development",
        description: "Node.js, Python, PostgreSQL, REST APIs",
        color: "from-emerald-500 to-emerald-600",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
        icon: Globe,
        title: "Full Stack Applications",
        description: "MERN Stack, Supabase, Cloud Deployment",
        color: "from-purple-500 to-purple-600",
        bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
        icon: Layers,
        title: "Software Architecture",
        description: "Scalable systems, clean code, CI/CD",
        color: "from-amber-500 to-amber-600",
        bg: "bg-amber-50 dark:bg-amber-900/20",
    },
];

const experience = [
    {
        role: "Lead Web Developer",
        company: "Tech Company",
        period: "2023 - Present",
        description: "Leading frontend development, architecture decisions, and mentoring junior developers.",
    },
    {
        role: "Full Stack Developer",
        company: "Software Agency",
        period: "2022 - 2023",
        description: "Built scalable web applications using React, Node.js, and PostgreSQL.",
    },
    {
        role: "Backend Developer",
        company: "Startup",
        period: "2021 - 2022",
        description: "Designed and implemented REST APIs, database schemas, and server infrastructure.",
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

export default function ResumePage() {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!supabase) {
                setLoading(false);
                return;
            }
            const { data } = await supabase.from("profiles").select("resume_url").limit(1).maybeSingle();
            if (data) setResumeUrl(data.resume_url);
            setLoading(false);
        };
        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-20 pt-12">
                <div className="container mx-auto px-6 max-w-5xl">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">My Resume</h1>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl">
                        A summary of my skills, experience, and education. Download the full PDF for more details.
                    </p>

                    {loading ? (
                        <div className="inline-flex px-6 py-3 bg-white/10 rounded-full animate-pulse gap-2">
                            <Loader2 className="animate-spin" size={18} />
                            <span>Loading Resume...</span>
                        </div>
                    ) : resumeUrl ? (
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                        >
                            <Download size={18} />
                            Download PDF
                        </a>
                    ) : (
                        <button disabled className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-400 font-bold rounded-full cursor-not-allowed">
                            <Download size={18} />
                            Resume Not Available
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 max-w-5xl pb-12 -mt-10">
                {/* Skills Highlights */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14"
                >
                    {highlights.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <div className={`bg-gradient-to-br ${item.color} rounded-lg w-8 h-8 flex items-center justify-center`}>
                                        <IconComponent size={18} className="text-white" />
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Experience */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 mb-8 border border-gray-100 dark:border-gray-800"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                            <Briefcase size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h3>
                    </div>
                    <div className="space-y-6">
                        {experience.map((exp, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                    {i < experience.length - 1 && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1" />}
                                </div>
                                <div className="pb-2">
                                    <h4 className="font-bold text-gray-900 dark:text-white">{exp.role}</h4>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{exp.company} • {exp.period}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Education */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-800"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                            <GraduationCap size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
                    </div>
                    {education.map((edu, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{edu.institution} • {edu.year}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
