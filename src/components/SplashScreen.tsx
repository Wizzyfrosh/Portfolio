"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Color palette matching the portfolio site ───
const ACCENT = "#2563eb";        // blue-600
const ACCENT_LIGHT = "#60a5fa";  // blue-400
const ACCENT_GLOW = "rgba(37,99,235,0.25)";
const ACCENT_SOFT = "rgba(37,99,235,0.08)";

const SPLASH_DURATION = 9400; // ms before fade-out begins (total ~10s with exit)

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"animate" | "exit">("animate");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("exit");
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const handleExitComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {phase === "animate" && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#0a0a0f" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Subtle radial gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${ACCENT_SOFT} 0%, transparent 60%)`,
            }}
          />

          {/* Soft animated grid lines for tech feel */}
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ delay: 0.3, duration: 1 }}
            style={{
              backgroundImage: `
                linear-gradient(${ACCENT} 1px, transparent 1px),
                linear-gradient(90deg, ${ACCENT} 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Floating particles */}
          <SplashParticles />

          {/* Main logo container */}
          <div className="relative flex flex-col items-center">
            {/* Orbit ring + planet + icon */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 flex items-center justify-center">
              {/* Glow backdrop behind ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                style={{
                  background: `radial-gradient(circle, ${ACCENT_SOFT} 0%, transparent 70%)`,
                  filter: "blur(24px)",
                }}
              />

              {/* Orbit ring SVG */}
              <svg
                className="absolute w-full h-full"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer orbit glow (blurred) */}
                <motion.ellipse
                  cx="100"
                  cy="105"
                  rx="90"
                  ry="32"
                  stroke={`rgba(37,99,235,0.15)`}
                  strokeWidth="6"
                  fill="none"
                  transform="rotate(-12, 100, 105)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: 1.5, duration: 2.0, ease: "easeInOut" },
                    opacity: { delay: 1.5, duration: 0.5 },
                  }}
                  style={{ filter: "blur(4px)" }}
                />
                {/* Main orbit ring */}
                <motion.ellipse
                  cx="100"
                  cy="105"
                  rx="88"
                  ry="30"
                  stroke="url(#orbitGradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  transform="rotate(-12, 100, 105)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: 1.8, duration: 1.8, ease: "easeInOut" },
                    opacity: { delay: 1.8, duration: 0.5 },
                  }}
                />
                {/* Second thin orbit for depth */}
                <motion.ellipse
                  cx="100"
                  cy="108"
                  rx="92"
                  ry="26"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  fill="none"
                  transform="rotate(-8, 100, 108)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: 2.2, duration: 1.5, ease: "easeInOut" },
                    opacity: { delay: 2.2, duration: 0.4 },
                  }}
                />
                {/* Orbit node (small circle on the ring) */}
                <motion.circle
                  cx="14"
                  cy="93"
                  r="3.5"
                  fill={ACCENT}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.8, duration: 0.5, ease: "backOut" }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${ACCENT}) drop-shadow(0 0 12px ${ACCENT_GLOW})`,
                  }}
                />
                <defs>
                  <linearGradient
                    id="orbitGradient"
                    x1="10"
                    y1="105"
                    x2="190"
                    y2="105"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={ACCENT} />
                    <stop offset="50%" stopColor={ACCENT_LIGHT} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Planet / dark sphere */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: "55%",
                  height: "55%",
                  background:
                    "radial-gradient(circle at 35% 35%, #1a1a2e 0%, #0d0d14 60%, #07070a 100%)",
                  boxShadow: `0 0 40px rgba(0,0,0,0.9), inset 0 -6px 16px rgba(37,99,235,0.06), 0 0 60px ${ACCENT_SOFT}`,
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* </> Code icon */}
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 3.0,
                  duration: 1.0,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <svg
                  width="52"
                  height="42"
                  viewBox="0 0 52 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-[60px] sm:h-[48px] md:w-[68px] md:h-[54px]"
                >
                  {/* < bracket */}
                  <motion.path
                    d="M16 8L4 21L16 34"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 3.5, duration: 0.7, ease: "easeOut" }}
                  />
                  {/* / slash */}
                  <motion.path
                    d="M22 36L30 6"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 3.8, duration: 0.6, ease: "easeOut" }}
                  />
                  {/* > bracket */}
                  <motion.path
                    d="M36 8L48 21L36 34"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 4.1, duration: 0.7, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>

              {/* Sparkle star */}
              <motion.div
                className="absolute"
                style={{ top: "18%", right: "22%" }}
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 4.8, duration: 0.5, ease: "backOut" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0L13.5 9L22 6L15 12L22 18L13.5 15L12 24L10.5 15L2 18L9 12L2 6L10.5 9L12 0Z" />
                </svg>
              </motion.div>
            </div>

            {/* ─── Text section ─── */}
            <div className="mt-5 sm:mt-7 overflow-hidden">
              {/* WizzyFrosh text — reveals from below */}
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{
                  delay: 5.2,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-white text-center"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 5.2,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  Wizzy
                  <span style={{ color: ACCENT_LIGHT }}>Frosh</span>
                </motion.h1>
              </motion.div>

              {/* CODEORBIT subtitle */}
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{
                  delay: 6.0,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.p
                  className="text-[10px] sm:text-xs md:text-sm tracking-[0.35em] sm:tracking-[0.45em] text-center font-medium uppercase mt-1.5"
                  style={{ color: ACCENT_LIGHT }}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 6.0,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  CodeOrbit
                </motion.p>
              </motion.div>
            </div>

            {/* Subtle tagline */}
            <motion.p
              className="mt-4 text-[11px] sm:text-xs tracking-widest uppercase text-gray-500 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6.8, duration: 1.0, ease: "easeOut" }}
            >
              Web & Software Developer
            </motion.p>

            {/* ─── Blue glow pulse — final emphasis ─── */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 35%, ${ACCENT_GLOW} 0%, transparent 55%)`,
                filter: "blur(35px)",
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: [0, 0, 0.7, 0.35, 0.6, 0.35, 0.5, 0.3],
                scale: [0.7, 0.7, 1.15, 1, 1.08, 1, 1.04, 1],
              }}
              transition={{
                delay: 7.2,
                duration: 1.8,
                times: [0, 0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
                ease: "easeInOut",
              }}
            />

            {/* Loading bar — subtle progress indicator */}
            <motion.div
              className="mt-8 w-32 sm:w-40 h-[2px] rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 7.0, duration: 0.5 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  delay: 7.0,
                  duration: 2.4,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Subtle floating particles for depth ─── */
function SplashParticles() {
  const particles = [
    { x: "12%", y: "18%", size: 2.5, delay: 1.5 },
    { x: "82%", y: "25%", size: 2, delay: 2.0 },
    { x: "20%", y: "72%", size: 1.5, delay: 3.0 },
    { x: "75%", y: "78%", size: 2.5, delay: 2.2 },
    { x: "50%", y: "12%", size: 2, delay: 2.8 },
    { x: "88%", y: "55%", size: 1.5, delay: 3.5 },
    { x: "8%",  y: "50%", size: 1.5, delay: 4.0 },
    { x: "65%", y: "10%", size: 2, delay: 4.5 },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: ACCENT_LIGHT,
            boxShadow: `0 0 ${p.size * 4}px ${ACCENT_GLOW}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0.25, 0.5, 0.2],
            scale: [0, 1, 0.8, 1, 0.6],
            y: [0, -10, 2, -8, 0],
          }}
          transition={{
            delay: p.delay,
            duration: 5.0,
            repeat: 0,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

/* ─── Hook to manage splash visibility ─── */
export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Always show splash on page load / refresh
    setShowSplash(true);
    setIsReady(true);
  }, []);

  const handleComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return { showSplash, isReady, handleComplete };
}
