"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 h-14 px-6 flex items-center justify-between"
      style={{
        background: scrolled ? "rgba(8,10,14,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"}`,
        transition: "all 0.3s ease",
      }}
    >
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-mono text-sm font-semibold"
          style={{ color: "#4D9EFF" }}
        >
          gb/
        </a>

        {/* Center links - desktop only */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#roast"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#roast")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm font-medium transition-colors hover:text-white flex items-center gap-1.5"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <span>🔥</span>
            <span>Roast</span>
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="hidden sm:inline">star on github</span>
          </a>
          
          <button
            onClick={() => document.querySelector("#tool")?.scrollIntoView({ behavior: "smooth" })}
            className="px-4 py-2 text-sm font-medium transition-all hover:bg-white/10"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "6px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            get started
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
