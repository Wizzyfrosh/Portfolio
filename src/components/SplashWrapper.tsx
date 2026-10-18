"use client";

import { ReactNode, useEffect } from "react";
import SplashScreen, { useSplashScreen } from "@/components/SplashScreen";
import { LoaderCircle } from "lucide-react";

interface SplashWrapperProps {
  children: ReactNode;
}

export default function SplashWrapper({ children }: SplashWrapperProps) {
  const { showSplash, isReady, handleComplete } = useSplashScreen();
  const isBlocked = !isReady || showSplash;

  // Fail open if a browser suspends/skips Framer Motion's splash exit callback.
  useEffect(() => {
    if (!isReady || !showSplash) return;
    const fallback = window.setTimeout(handleComplete, 11400);
    return () => window.clearTimeout(fallback);
  }, [isReady, showSplash, handleComplete]);

  return (
    <>
      {/* Render the homepage exactly once, including in server HTML for SEO.
          Overlay it until the intro or reload spinner completes. */}
      <div
        aria-hidden={isBlocked}
        className={`min-h-screen transition-opacity duration-500 ease-out motion-reduce:transition-none ${isBlocked ? "pointer-events-none select-none opacity-0" : "opacity-100"}`}
      >
        {children}
      </div>

      {/* Spinner on initial hydration and hard reloads; no second copy of page content. */}
      {!isReady && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0f]"
          role="status" aria-label="Loading portfolio">
          <LoaderCircle className="h-9 w-9 animate-spin text-blue-400 motion-reduce:animate-none" aria-hidden="true" />
          <span className="sr-only">Loading portfolio</span>
        </div>
      )}

      {/* Full branded splash only on new entry, never on hard reload. */}
      {isReady && showSplash && <SplashScreen onComplete={handleComplete} />}
    </>
  );
}
