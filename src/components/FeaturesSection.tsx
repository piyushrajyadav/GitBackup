"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Feature {
  number: string;
  title: string;
  description: string;
  visual: string;
}

const features: Feature[] = [
  {
    number: "01",
    title: "Zero Backend Required",
    description: "Everything runs in your browser. No servers, no databases, no tracking. Your data never touches our infrastructure because we don't have any.",
    visual: "🏗️",
  },
  {
    number: "02",
    title: "Complete Code Export",
    description: "Download actual source code, not just metadata. Every file, every folder, every branch - packaged into a single ZIP archive ready for offline access.",
    visual: "📦",
  },
  {
    number: "03",
    title: "Private Repo Support",
    description: "Add your GitHub token to access private repositories. The token never leaves your browser and is never stored or transmitted to any server.",
    visual: "🔐",
  },
  {
    number: "04",
    title: "Instant Cloud Backup",
    description: "Push directly to your S3, Google Cloud, or Azure storage. Use your own keys - we never see or store your credentials. Pure client-side encryption.",
    visual: "☁️",
  },
];

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.min(
        Math.floor(latest * features.length),
        features.length - 1
      );
      setActiveIndex(index);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${features.length * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, rgba(8, 10, 14, 1) 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text content */}
            <div className="relative h-full flex items-center">
              <div className="w-full">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activeIndex === index ? 1 : 0,
                      y: activeIndex === index ? 0 : 20,
                      scale: activeIndex === index ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                    style={{
                      position: activeIndex === index ? "relative" : "absolute",
                      visibility: activeIndex === index ? "visible" : "hidden",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="text-6xl font-bold font-mono"
                        style={{
                          color: "rgba(99, 102, 241, 1)",
                        }}
                      >
                        {feature.number}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent" />
                    </div>

                    <h3
                      className="text-3xl md:text-4xl font-bold"
                      style={{
                        fontFamily: "'General Sans', sans-serif",
                        color: "rgb(255, 255, 255)",
                      }}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className="text-lg leading-relaxed max-w-xl"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Visual mockup */}
            <div className="hidden lg:block">
              <motion.div
                className="relative liquid-glass rounded-3xl p-8 backdrop-blur-xl"
                style={{
                  minHeight: "500px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Animated visual based on active feature */}
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center space-y-6">
                    <div className="text-9xl">{features[activeIndex].visual}</div>
                    <div
                      className="text-xl font-semibold"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {features[activeIndex].title}
                    </div>
                  </div>
                </motion.div>

                {/* Progress indicator */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex gap-2">
                    {features.map((_, index) => (
                      <div
                        key={index}
                        className="h-1 flex-1 rounded-full transition-all duration-500"
                        style={{
                          background: index === activeIndex 
                            ? "rgba(99, 102, 241, 1)" 
                            : "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Mobile progress dots */}
          <div className="lg:hidden flex justify-center gap-3 mt-12">
            {features.map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full transition-all duration-500"
                style={{
                  background: index === activeIndex 
                    ? "rgba(99, 102, 241, 1)" 
                    : "rgba(255, 255, 255, 0.2)",
                  scale: index === activeIndex ? 1.2 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
