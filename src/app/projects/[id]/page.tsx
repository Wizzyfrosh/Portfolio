import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Github, Globe, Download, Calendar } from "lucide-react";

export const revalidate = 0;

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
    const { id } = await params;

    const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <p className="text-gray-500 mb-8">The project you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/#projects"
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const screenshots = project.screenshots || [];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="container mx-auto px-6 max-w-5xl py-8">
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{project.title}</h1>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech_stack?.map((tech: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap gap-4">
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
                            >
                                <Globe size={18} />
                                View Live Site
                            </a>
                        )}
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
                            >
                                <Github size={18} />
                                Source Code
                            </a>
                        )}
                        {project.apk_url && (
                            <a
                                href={project.apk_url}
                                download
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/25"
                            >
                                <Download size={18} />
                                Download APK File
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 max-w-5xl py-12">
                {/* Description */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Project</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                        {project.description}
                    </p>
                </div>

                {/* Date */}
                {project.created_at && (
                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm mb-12">
                        <Calendar size={14} />
                        <span>Added on {new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                )}

                {/* Screenshots Gallery */}
                {screenshots.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Screenshots</h2>
                        {/* Smaller grid: grid-cols-2 md:grid-cols-3 and limiting height/aspect */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {screenshots.map((src: string, index: number) => (
                                <div
                                    key={index}
                                    className="relative group rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 aspect-[9/16] bg-gray-50 dark:bg-gray-800"
                                >
                                    <img
                                        src={src}
                                        alt={`${project.title} screenshot ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Overlay for "View" or just simple hover effect */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tech Details */}
                <div className="bg-gray-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Technologies Used</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {project.tech_stack?.map((tech: string, index: number) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                            >
                                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                <span className="font-medium text-gray-700">{tech}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
