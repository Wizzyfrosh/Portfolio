"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";
import { PlusCircle, Edit2, Trash2, Eye } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Error fetching projects:", error);
        else setProjects(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) {
            alert("Error deleting project");
            console.error(error);
        } else {
            fetchProjects(); // Refresh list
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <Link
                    href="/admin/projects/new"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle size={20} />
                    Add Project
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-lg mb-4">No projects found.</p>
                    <Link href="/admin/projects/new" className="text-blue-600 font-medium hover:underline">
                        Create your first project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                        >
                            <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                {project.screenshots && project.screenshots.length > 0 ? (
                                    <img src={project.screenshots[0]} alt={project.title} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                                )}
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.tech_stack?.map((tech: string) => (
                                        <span key={tech} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${project.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {project.published ? 'Published' : 'Draft'}
                                </div>
                                <Link
                                    href={`/admin/projects/${project.id}/edit`}
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={20} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
