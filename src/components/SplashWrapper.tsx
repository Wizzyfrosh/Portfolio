"use client";

import { ReactNode } from "react";
import SplashScreen, { useSplashScreen } from "@/components/SplashScreen";
import { AnimatePresence, motion } from "framer-motion";

interface SplashWrapperProps {
  children: ReactNode;
}

export default function SplashWrapper({ children }: SplashWrapperProps) {
  const { showSplash, isReady, handleComplete } = useSplashScreen();

  // Prevent layout shift — render solid bg until we know splash state
  if (!isReady) {
    return (
      <div
        className="fixed inset-0 z-[9999]"
        style={{ background: "#0a0a0f" }}
      />
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
