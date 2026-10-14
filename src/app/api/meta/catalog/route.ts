import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  return '"' + String(value ?? "").replace(/"/g, '""').replace(/[\r\n]+/g, " ").trim() + '"';
}

type CatalogSetting = { enabled?: boolean; priceNgn?: number };

export async function GET(request: NextRequest) {
  const secret = process.env.META_CATALOG_FEED_KEY;
  const supplied = request.nextUrl.searchParams.get("key");
  if (!secret || !supplied || supplied !== secret) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return new NextResponse("Catalog feed unavailable", { status: 503 });
  }

  let settings: Record<string, CatalogSetting>;
  try {
    settings = JSON.parse(process.env.META_CATALOG_ITEMS_JSON || "{}");
    if (!settings || Array.isArray(settings) || typeof settings !== "object") throw new Error();
  } catch {
    return new NextResponse("Invalid catalog configuration", { status: 503 });
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,description,screenshots,live_url,published")
    .eq("published", true);

  if (error) return new NextResponse("Catalog feed unavailable", { status: 503 });

  const columns = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand"];
  const rows = [columns.map(csvCell).join(",")];
  for (const project of data ?? []) {
    const setting = settings[String(project.id)];
    const price = setting?.priceNgn;
    const image = Array.isArray(project.screenshots) ? project.screenshots[0] : null;
    if (setting?.enabled !== true || !Number.isFinite(price) || !price || price <= 0) continue;
    if (!project.title || !project.description || !image || !project.live_url) continue;
    try {
      if (new URL(image).protocol !== "https:" || new URL(project.live_url).protocol !== "https:") continue;
    } catch { continue; }
    rows.push([
      project.id, project.title, project.description, "in stock", "new",
      price.toFixed(2) + " NGN", project.live_url, image, "FroshCodeOrbit",
    ].map(csvCell).join(","));
  }

  return new NextResponse(rows.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
