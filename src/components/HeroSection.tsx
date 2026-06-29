"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrame: number;
    let isTransitioning = false;

    const handleTimeUpdate = () => {
      if (isTransitioning) return;
      
      const duration = video.duration;
      const currentTime = video.currentTime;
      
      // Start fade out 0.5s before end
      if (duration - currentTime <= 0.5) {
        isTransitioning = true;
        const fadeOut = () => {
          const remaining = duration - video.currentTime;
          video.style.opacity = String(Math.max(0, remaining / 0.5));
          
          if (remaining > 0) {
            animationFrame = requestAnimationFrame(fadeOut);
          }
        };
        fadeOut();
      }
    };

    const handleEnded = () => {
      isTransitioning = false;
      video.style.opacity = "0";
      video.currentTime = 0;
      
      setTimeout(() => {
        const fadeIn = () => {
          const progress = video.currentTime / 0.5;
          video.style.opacity = String(Math.min(1, progress));
          
          if (progress < 1) {
            animationFrame = requestAnimationFrame(fadeIn);
          }
        };
        
        video.play();
        fadeIn();
      }, 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // Initial fade in
    video.style.opacity = "0";
    video.play().then(() => {
      const fadeIn = () => {
        const progress = video.currentTime / 0.5;
        video.style.opacity = String(Math.min(1, progress));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(fadeIn);
        }
      };
      fadeIn();
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  const scrollToTool = () => {
    document.querySelector("#tool")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-visible">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
          type="video/mp4"
        />
      </video>

      {/* Blurred overlay shape */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "984px",
          height: "527px",
          opacity: 0.9,
          background: "rgb(3 7 18)",
          filter: "blur(82px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="py-5 px-8 flex items-center justify-between">
          <div className="flex items-center">
            <span
              className="font-mono font-semibold text-2xl"
              style={{ color: "#4D9EFF" }}
            >
              gb/
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.9)" }}>
              Features
            </button>
            <button className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.9)" }}>
              Backup
            </button>
            <a
              href="#roast"
              className="text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Roast
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener"
              className="hidden sm:flex items-center gap-2 text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <button
              onClick={scrollToTool}
              className="liquid-glass rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-white/5 transition-all"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Divider */}
        <div
          className="h-px mx-8 mt-[3px]"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4"
            style={{
              fontFamily: "'General Sans', sans-serif",
              fontSize: "clamp(64px, 12vw, 220px)",
              lineHeight: 1.02,
              letterSpacing: "-0.024em",
              fontWeight: 400,
            }}
          >
            <span style={{ color: "rgb(var(--foreground))" }}>Your repos, </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)",
              }}
            >
              safe forever
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg leading-8 max-w-md mx-auto opacity-80 mb-6"
            style={{ color: "rgb(var(--hero-sub))" }}
          >
            The most powerful GitHub backup tool
            <br />
            ever built for developers
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={scrollToTool}
            className="liquid-glass rounded-full px-7 py-6 text-base font-semibold text-white hover:bg-white/5 transition-all hover:scale-105 active:scale-95"
          >
            Start Backing Up
          </motion.button>
        </div>
      </div>
    </section>
  );
}
