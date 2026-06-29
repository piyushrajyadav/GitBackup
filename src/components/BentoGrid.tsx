"use client";

import { motion } from "framer-motion";
import { Download, Shield, Cloud, Zap, Lock, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Download,
    title: "Any GitHub User",
    description: "Generate organized repository catalogs from any public profile. Add a token for private repos.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "100% Client-Side",
    description: "Everything runs in your browser. No backend, no database, zero tracking.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cloud,
    title: "Comprehensive Metadata",
    description: "Get repo info, clone URLs, download links, and statistics - all organized in one place.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "Instant Export",
    description: "Generate complete repository catalogs in seconds, regardless of how many repos.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Lock,
    title: "Private Repos",
    description: "Support for private repositories with secure token handling directly in your browser.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Repository Analytics",
    description: "Visual breakdowns of languages, stars, sizes, and last update times across all repos.",
    color: "from-pink-500 to-rose-500",
  },
];

export default function BentoGrid() {
  return (
    <section id="features" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      
      <div className="relative max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Powerful tools for cataloging and documenting GitHub repositories
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative glow-box rounded-2xl border border-white/10 bg-[rgb(var(--card))] p-6 hover:border-white/20 transition-all"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity -z-10`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
