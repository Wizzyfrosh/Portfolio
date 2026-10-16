import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ContentEngagement from "@/components/ContentEngagement";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github, Globe, Download, Calendar, Image as ImageIcon } from "lucide-react";

export const revalidate = 0;
interface ProjectPageProps { params: Promise<{ id: string }> }
const siteUrl = "https://www.froshcodeorbit.site";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!supabase) return { title: "Project unavailable", robots: { index: false } };
  const { data: project } = await supabase.from("projects")
    .select("title,description,screenshots").eq("id", id).eq("published", true).maybeSingle();
  if (!project) return { title: "Project not found", robots: { index: false } };
  const canonical = `${siteUrl}/projects/${encodeURIComponent(id)}`;
  const description = String(project.description || "Explore this software project by Frosh CodeOrbit.").slice(0, 160);
  const images: string[] = Array.isArray(project.screenshots)
    ? project.screenshots.filter((image: unknown): image is string => typeof image === "string" && image.startsWith("https://")).slice(0, 1)
    : [];
  return {
    title: project.title, description, alternates: { canonical },
    openGraph: { title: project.title, description, url: canonical, type: "article", ...(images.length ? { images } : {}) },
    twitter: { card: images.length ? "summary_large_image" : "summary", title: project.title, description, ...(images.length ? { images } : {}) },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  if (!supabase) notFound();
  const { data: project, error } = await supabase.from("projects")
    .select("*").eq("id", id).eq("published", true).maybeSingle();
  if (error || !project) notFound();

  const screenshots: string[] = Array.isArray(project.screenshots)
    ? project.screenshots.filter((value: unknown): value is string => typeof value === "string" && value.startsWith("https://"))
    : [];
  const tech: string[] = Array.isArray(project.tech_stack) ? project.tech_stack : [];

  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-28 text-slate-900 dark:bg-slate-950 dark:text-white sm:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"><ArrowLeft size={17}/> Back to all projects</Link>
        <article className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_-40px_rgba(15,23,42,.4)] dark:border-slate-800 dark:bg-slate-900">
          <header className="border-b border-slate-100 px-5 py-8 dark:border-slate-800 sm:px-10 sm:py-10">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-blue-700 dark:bg-blue-950 dark:text-blue-300">Portfolio project</span>
              {project.created_at && <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400"><Calendar size={14}/>{new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>}
            </div>
            <h1 className="max-w-4xl break-words text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">{project.title}</h1>
            <p className="mt-5 max-w-3xl whitespace-pre-line break-words text-base leading-8 text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="mt-6"><ContentEngagement type="project" id={project.id}/></div>
            <div className="mt-6 flex flex-wrap gap-2">
              {tech.map((name, i) => <span key={i} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{name}</span>)}
            </div>
            {(project.live_url || project.github_url || project.apk_url) && <div className="mt-7 flex flex-wrap gap-3">
              {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"><Globe size={17}/> Live website <ArrowUpRight size={16}/></a>}
              {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 dark:border-slate-700 dark:text-white"><Github size={17}/> Source code</a>}
              {project.apk_url && <a href={project.apk_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 dark:border-slate-700 dark:text-white"><Download size={17}/> Download APK</a>}
            </div>}
          </header>
          <div className="grid gap-8 p-5 sm:p-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(240px,0.85fr)]">
            <div className="min-w-0 space-y-8">
              {screenshots.length > 0 && <section aria-label="Project showcase">
                <div className="mb-4 flex items-center gap-2"><ImageIcon size={19} className="text-blue-600"/><h2 className="text-xl font-extrabold">Project gallery</h2></div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  <img src={screenshots[0]} alt={`${project.title} primary screenshot`} className="aspect-[16/10] w-full object-contain"/>
                </div>
                {screenshots.length > 1 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {screenshots.slice(1).map((src, index) => <a key={index} href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800" aria-label={`Open project screenshot ${index + 2}`}><img src={src} alt={`${project.title} screenshot ${index + 2}`} loading="lazy" className="aspect-[4/3] w-full object-cover object-top"/></a>)}
                </div>}
              </section>}
              {screenshots.length === 0 && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500 dark:border-slate-700 dark:bg-slate-800">More project images will be added soon.</div>}
            </div>
            <aside className="min-w-0">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800 lg:sticky lg:top-28 sm:p-6">
                <h2 className="text-lg font-extrabold">Project overview</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Explore the build, technologies and links for this project.</p>
                <div className="my-5 border-t border-slate-200 dark:border-slate-700"/>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Technology stack</p>
                {tech.length > 0 ? <div className="flex flex-wrap gap-2">{tech.map((name,i)=><span key={i} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">{name}</span>)}</div> : <p className="text-sm text-slate-500">Details coming soon</p>}
                <Link href="/#contact" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">Discuss a project <ArrowUpRight size={16}/></Link>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
