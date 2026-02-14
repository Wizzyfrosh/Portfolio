"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    apk_url: string | null;
    live_url: string | null;
    github_url: string | null;
    screenshots: string[] | null;
}

const MAX_VISIBLE_TAGS = 3;

export default function ProjectCard({ project }: { project: Project }) {
    const screenshot = project.screenshots && project.screenshots.length > 0
        ? project.screenshots[0]
        : "https://placehold.co/600x400/png?text=No+Image";

    const visibleTags = project.tech_stack?.slice(0, MAX_VISIBLE_TAGS) || [];
    const hiddenCount = (project.tech_stack?.length || 0) - MAX_VISIBLE_TAGS;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full group"
        >
            {/* Image */}
            <div className="relative h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                    src={screenshot}
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">{project.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                    {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                    {visibleTags.map((tech, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full"
                        >
                            {tech}
                        </span>
                    ))}
                    {hiddenCount > 0 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full">
                            +{hiddenCount}
                        </span>
                    )}
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-3 mt-auto">
                    <Link
                        href={`/projects/${project.id}`}
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1.5 shadow-md hover:shadow-blue-500/25"
                    >
                        <Eye size={14} />
                        View Details
                    </Link>

                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200"
                            title="Live Demo"
                        >
                            <ExternalLink size={15} />
                        </a>
                    )}

                    {project.github_url && (
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-400 transition-colors duration-200"
                            title="View Code"
                        >
                            <Github size={15} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
