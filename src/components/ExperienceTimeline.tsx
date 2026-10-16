"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const experienceItems = [
  { role: "Lead Web Developer", period: "2020 - 2022" },
  { role: "Full Stack Developer", period: "2022 - 2026" },
  { role: "Backend Developer", period: "2022 - 2026" },
];

export default function ExperienceTimeline() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-4 lg:mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">EXPERIENCE</h2>
        <div className="h-px flex-grow bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="space-y-4">
        {experienceItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-5 transition-all hover:border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900 sm:p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white sm:text-xl">{item.role}</h3>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-500 dark:text-gray-400">{item.period}</span>
              <ArrowUpRight size={20} className="text-gray-400 transition-colors group-hover:text-blue-600" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
