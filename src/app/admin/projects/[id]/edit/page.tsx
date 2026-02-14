"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import ProjectForm from "@/components/admin/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!supabase) {
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", id)
                .single();

            if (error) console.error("Error loading project:", error);
            else setProject(data);

            setLoading(false);
        };

        if (id) fetchProject();
    }, [id]);

    if (loading) return <div className="text-center py-12">Loading...</div>;

    if (!project) return <div className="text-center py-12">Project not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={20} />
                Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Project</h1>
            <ProjectForm initialData={project} />
        </div>
    );
}
