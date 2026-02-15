"use client";

import { motion } from "framer-motion";

const skills = [
    "WEB DEVELOPMENT",
    "SOFTWARE",
    "FULL STACK",
    "BACKEND",
    "FRONTEND",
    "WEB DEVELOPMENT",
    "SOFTWARE",
    "FULL STACK",
    "BACKEND",
    "FRONTEND",
];

export default function SkillsBar() {
    return (
        <div className="bg-gray-900 dark:bg-gray-800 py-3 overflow-hidden rounded-2xl max-w-[480px] mx-auto mt-2 border border-gray-800 dark:border-gray-700 shadow-xl transition-colors duration-300">
            <motion.div
                animate={{ x: [0, -800] }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="flex whitespace-nowrap items-center text-white"
            >
                {skills.map((skill, i) => (
                    <div key={i} className="flex items-center mx-5">
                        <span className="text-xs font-bold tracking-[0.15em]">{skill}</span>
                        <span className="mx-5 text-gray-500">•</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
