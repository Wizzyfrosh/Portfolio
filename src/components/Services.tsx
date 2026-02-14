"use client";

import { motion } from "framer-motion";
import { Monitor, Cpu, Server, ArrowRight } from "lucide-react";

const offerings = [
    {
        num: "01",
        icon: Monitor,
        title: "WEB DEVELOPMENT",
        description: "Building modern, responsive websites with cutting-edge technologies and beautiful user interfaces.",
        tech: ["JavaScript", "React", "Next.js"],
        color: "from-blue-500 to-blue-600",
        lightColor: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-600 dark:text-blue-400",
        borderColor: "border-l-blue-500",
        shadowColor: "shadow-blue-500/10",
        tagBg: "bg-blue-50 dark:bg-blue-900/20",
        tagText: "text-blue-700 dark:text-blue-300",
    },
    {
        num: "02",
        icon: Cpu,
        title: "SOFTWARE DEVELOPMENT",
        description: "Creating powerful, scalable applications with clean architecture and robust backend systems.",
        tech: ["Node.js", "Python", "TypeScript"],
        color: "from-purple-500 to-purple-600",
        lightColor: "bg-purple-50 dark:bg-purple-900/20",
        textColor: "text-purple-600 dark:text-purple-400",
        borderColor: "border-l-purple-500",
        shadowColor: "shadow-purple-500/10",
        tagBg: "bg-purple-50 dark:bg-purple-900/20",
        tagText: "text-purple-700 dark:text-purple-300",
    },
    {
        num: "03",
        icon: Server,
        title: "FULL STACK DEVELOPMENT",
        description: "End-to-end development of web applications, from database design to deployment and monitoring.",
        tech: ["MERN", "REST API", "SQL"],
        color: "from-emerald-500 to-emerald-600",
        lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
        textColor: "text-emerald-600 dark:text-emerald-400",
        borderColor: "border-l-emerald-500",
        shadowColor: "shadow-emerald-500/10",
        tagBg: "bg-emerald-50 dark:bg-emerald-900/20",
        tagText: "text-emerald-700 dark:text-emerald-300",
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function Services() {
    return (
        <section id="services" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-center gap-4 mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight whitespace-nowrap">
                        WHAT I&apos;M OFFERING
                    </h2>
                    <div className="flex-grow h-[1px] bg-gray-200 dark:bg-gray-700" />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid md:grid-cols-3 gap-7"
                >
                    {offerings.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={item.num}
                                variants={cardVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`relative p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 ${item.shadowColor} shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col overflow-hidden border-l-4 ${item.borderColor}`}
                            >
                                {/* Number label */}
                                <span className="absolute top-5 right-5 text-5xl font-black text-gray-100/80 dark:text-gray-700/50 select-none leading-none">
                                    {item.num}
                                </span>

                                {/* Icon */}
                                <div className={`w-14 h-14 ${item.lightColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <div className={`bg-gradient-to-br ${item.color} rounded-lg w-10 h-10 flex items-center justify-center`}>
                                        <IconComponent size={22} className="text-white" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white uppercase tracking-wide">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-sm flex-grow">
                                    {item.description}
                                </p>

                                {/* Tech Tags */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {item.tech.map((t, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-3 py-1 ${item.tagBg} ${item.tagText} text-xs font-semibold rounded-full`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center justify-end">
                                    <span className={`${item.textColor} group-hover:translate-x-1 transition-transform duration-200`}>
                                        <ArrowRight size={20} />
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
