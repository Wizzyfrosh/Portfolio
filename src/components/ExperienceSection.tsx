import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import TemplateCard, { type StoreTemplate } from "@/components/TemplateCard";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import DeveloperVisual from "@/components/DeveloperVisual";

export default async function ExperienceSection() {
  const { data: templates, error } = supabase
    ? await supabase.from("website_templates")
        .select("id,slug,title,description,cover_image,price_kobo,product_type")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: [] as StoreTemplate[], error: null };

  if (error) console.error("Unable to load homepage products:", error.message);

  return (
    <section id="experience" className="scroll-mt-28 bg-white py-20 transition-colors dark:bg-gray-950 sm:py-24">
      <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-6 lg:space-y-24">
        {/* Separate, full-width sections. Experience must always precede the marketplace. */}
        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          <ExperienceTimeline />
          <DeveloperVisual />
        </div>

        <div id="templates" className="min-w-0 scroll-mt-28">
          <div className="mb-4 flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">MARKETPLACE</h2>
            <div className="h-px min-w-0 flex-grow bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <p className="max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
              Explore website templates, ebooks and study materials. Buy securely and access your digital downloads.
            </p>
            <Link
              href="/store"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950 sm:self-auto"
            >
              View all products <ArrowRight size={17} />
            </Link>
          </div>

          {templates?.length
            ? <div className="grid min-w-0 grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(templates as StoreTemplate[]).map(item => (
                  <TemplateCard key={item.id} item={item} />
                ))}
              </div>
            : <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                <ShoppingBag className="mb-3 text-blue-600" size={28} />
                New digital products will appear here soon.
              </div>}
        </div>
      </div>
    </section>
  );
}
