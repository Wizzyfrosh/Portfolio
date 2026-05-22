"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProjects() {
    // Revalidate the home page where ProjectsSection is rendered
    revalidatePath("/");
    
    // Revalidate the admin projects list
    revalidatePath("/admin/projects");
    
    // Revalidate the dynamic project detail pages 
    // using the layout path to catch all project pages
    revalidatePath("/projects/[id]", "page");
}
