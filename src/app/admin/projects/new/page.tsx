import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Project</h1>
            <ProjectForm />
        </div>
    );
}
