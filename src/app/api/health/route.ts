import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // Never cache this route

/**
 * GET /api/health
 *
 * Lightweight health-check endpoint that verifies Supabase connectivity.
 * Used by Vercel Cron to keep the serverless function warm and
 * detect database issues early.
 *
 * Security:
 *  - Uses server-only env vars (no NEXT_PUBLIC_ prefix exposure)
 *  - Falls back to NEXT_PUBLIC_ vars for compatibility
 *  - No sensitive data in response body
 *
 * Database impact:
 *  - Single-row SELECT with LIMIT 1 — virtually zero load
 */
export async function GET() {
  const start = Date.now();

  // Prefer server-only env vars, fall back to public ones for compatibility
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing Supabase configuration",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Minimal query — SELECT 1 row from profiles (exists in schema)
    // Uses .limit(1) to avoid any full table scan
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .maybeSingle();

    const latency = Date.now() - start;

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database query failed",
          latency_ms: latency,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        latency_ms: latency,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    const latency = Date.now() - start;

    return NextResponse.json(
      {
        status: "error",
        message: "Unexpected error",
        latency_ms: latency,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
