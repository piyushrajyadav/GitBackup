"use client";

import { motion } from "framer-motion";
import { User, Search, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: User,
    title: "Enter username",
    description: "Type any GitHub username. Yours or someone else's. No signup required.",
  },
  {
    number: "02",
    icon: Search,
    title: "We fetch repos",
    description: "Direct API calls from your browser. Every repository gets scanned.",
  },
  {
    number: "03",
    icon: Download,
    title: "Download ZIP",
    description: "All repos compressed into one file. Delivered to your machine instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      
      <div className="relative max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
            How it Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Three steps. Zero setup.
          </h2>
          <p className="text-lg text-white/60">
            From username to download in under 60 seconds
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Step number badge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg shadow-indigo-500/25">
                {step.number}
              </div>

              {/* Card */}
              <div className="relative mt-6 glow-box rounded-2xl border border-white/10 bg-[rgb(var(--card))] p-8 text-center">
                {/* Icon */}
                <div className="inline-flex p-4 rounded-xl bg-white/5 mb-4">
                  <step.icon className="w-8 h-8 text-indigo-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
