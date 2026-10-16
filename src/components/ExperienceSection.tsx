import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import TemplateCard, { type StoreTemplate } from "@/components/TemplateCard";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export default async function ExperienceSection() {
  const { data: templates, error } = supabase
    ? await supabase.from("website_templates")
        .select("id,slug,title,description,cover_image,price_kobo,product_type")
        .eq("published", true).order("created_at", { ascending: false }).limit(3)
    : { data: [] as StoreTemplate[], error: null };
  if (error) console.error("Unable to load homepage templates:", error.message);
  return (
    <section id="experience" className="scroll-mt-28 bg-white py-20 transition-colors dark:bg-gray-950 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 sm:px-6 xl:grid-cols-[minmax(250px,0.7fr)_minmax(0,2fr)] xl:gap-10">
        <ExperienceTimeline />
        <div id="templates" className="min-w-0 scroll-mt-28">
          <div className="mb-8 flex items-center gap-4 xl:mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">MARKETPLACE</h2>
            <div className="h-px min-w-0 flex-grow bg-gray-200 dark:bg-gray-700" />
          </div>
          <p className="-mt-4 mb-6 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300 xl:-mt-7">
            Browse website templates, ebooks and study materials. Explore products and purchase securely.
          </p>
          {templates?.length
            ? <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-2">
                {(templates as StoreTemplate[]).map(item => <TemplateCard key={item.id} item={item} />)}
              </div>
            : <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                <ShoppingBag className="mb-3 text-blue-600" size={28} />
                New templates will appear here soon.
              </div>}
          <Link href="/store" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            View all templates <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
