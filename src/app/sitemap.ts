import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const baseUrl = "https://www.froshcodeorbit.site";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/resume`, changeFrequency: "monthly", priority: 0.6 },
  ];

  if (!supabase) return pages;

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, created_at")
    .eq("published", true);

  if (error) {
    console.error("Unable to load projects for sitemap:", error);
    return pages;
  }

  type SitemapProject = { id: string | number; created_at: string | null };
  const projectPages: MetadataRoute.Sitemap = ((projects ?? []) as SitemapProject[]).map((project: SitemapProject) => ({
    url: `${baseUrl}/projects/${encodeURIComponent(String(project.id))}`,
    ...(project.created_at && !Number.isNaN(new Date(project.created_at).getTime())
      ? { lastModified: new Date(project.created_at) }
      : {}),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...projectPages];
}
