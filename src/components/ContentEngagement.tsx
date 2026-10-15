"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, Share2, Check, Link2 } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";

type ContentType = "template" | "project";
type LikeState = { count: number; liked: boolean };

function getVisitorId() {
  const key = "froshcodeorbit_like_visitor_v1";
  let value = localStorage.getItem(key);
  if (!value || !/^[0-9a-f-]{36}$/i.test(value)) {
    value = crypto.randomUUID();
    localStorage.setItem(key, value);
  }
  return value;
}

export default function ContentEngagement({
  type, id, sharePath, compact = false,
}: { type: ContentType; id: string; sharePath?: string; compact?: boolean }) {
  const [state, setState] = useState<LikeState>({ count: 0, liked: false });
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    try {
      const visitorId = getVisitorId();
      const { data, error } = await supabase.rpc("get_content_like_state", {
        p_content_type: type, p_content_id: id, p_visitor_id: visitorId,
      });
      if (error) throw error;
      setState({ count: Math.max(0, Number(data?.count) || 0), liked: data?.liked === true });
    } catch {
      setError("Likes are temporarily unavailable.");
    } finally { setReady(true); }
  }, [id, type]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(""), 2500);
    return () => clearTimeout(timeout);
  }, [feedback]);

  async function toggleLike() {
    if (!supabase || busy) return;
    setBusy(true); setError("");
    try {
      const { data, error } = await supabase.rpc("toggle_content_like", {
        p_content_type: type, p_content_id: id, p_visitor_id: getVisitorId(),
      });
      if (error) throw error;
      setState({ count: Math.max(0, Number(data?.count) || 0), liked: data?.liked === true });
    } catch {
      setError("Could not update your like. Please try again.");
    } finally { setBusy(false); }
  }

  async function share() {
    if (!sharePath) return;
    const url = new URL(sharePath, "https://www.froshcodeorbit.site").toString();
    try {
      // Copy first: the link remains useful for posting on any platform.
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied!");
    } catch {
      try {
        if (navigator.share) {
          await navigator.share({ url, title: "Check out this website template" });
          setFeedback("Ready to share");
        } else {
          setError("Please copy this link from the address bar.");
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== "AbortError") setError("Unable to share the link.");
      }
    }
  }

  return (
    <div className={compact ? "flex flex-wrap items-center gap-2" : "flex flex-wrap items-center gap-3"}>
      <button type="button" onClick={() => void toggleLike()} disabled={busy || !ready}
        aria-pressed={state.liked}
        aria-label={state.liked ? `Unlike this ${type}` : `Like this ${type}`}
        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${state.liked ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300" : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}>
        <Heart size={17} fill={state.liked ? "currentColor" : "none"} />
        <span>{state.liked ? "Liked" : "Like"}</span>
        <span className="tabular-nums" aria-label={`${state.count} likes`}>{ready ? state.count.toLocaleString("en-NG") : "…"}</span>
      </button>
      {sharePath && <button type="button" onClick={() => void share()}
        aria-label="Copy share link"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        {feedback === "Link copied!" ? <Check size={17}/> : <Share2 size={17}/>}
        <span>{feedback === "Link copied!" ? "Copied!" : "Share"}</span>
        <Link2 size={14}/>
      </button>}
      {error && <span role="status" className="basis-full text-xs text-rose-600">{error}</span>}
      {feedback && <span role="status" className="sr-only">{feedback}</span>}
    </div>
  );
}
