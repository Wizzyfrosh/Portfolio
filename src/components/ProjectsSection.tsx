import ProjectCard from "./ProjectCard";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function ProjectsSection() {
    if (!supabase) {
        return (
            <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xl">Projects are currently unavailable.</p>
                </div>
            </section>
        )
    }

    const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
    }

    return (
        <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                        MY PROJECTS
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
                        Explore my latest work and side projects
                    </p>
                </div>

                {!projects || projects.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400 text-xl">No projects published yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
