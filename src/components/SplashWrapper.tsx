"use client";

import { ReactNode, useEffect } from "react";
import SplashScreen, { useSplashScreen } from "@/components/SplashScreen";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

interface SplashWrapperProps {
  children: ReactNode;
}

export default function SplashWrapper({ children }: SplashWrapperProps) {
  const { showSplash, isReady, handleComplete } = useSplashScreen();

  // Safety net for interrupted tab animations or browsers that skip exit callbacks.
  useEffect(() => {
    if (!isReady || !showSplash) return;
    const fallback = window.setTimeout(handleComplete, 11400);
    return () => window.clearTimeout(fallback);
  }, [isReady, showSplash, handleComplete]);

  // Prevent layout shift — render solid bg until we know splash state
  if (!isReady) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0f]" role="status" aria-label="Loading portfolio">
        <LoaderCircle className="h-9 w-9 animate-spin text-blue-400" aria-hidden="true" />
        <span className="sr-only">Loading portfolio</span>
      </div>
    );
  }

  return (
    <>
      {/* Splash overlay */}
      {showSplash && <SplashScreen onComplete={handleComplete} />}

      {/* Main content — fades in after splash completes */}
      <AnimatePresence>
        {!showSplash && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden duplicate keeps server components hydrated during splash */}
      {showSplash && (
        <div className="sr-only" aria-hidden="true">
          {children}
        </div>
      )}
    </>
  );
}
