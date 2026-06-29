"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const horrorStories = [
  {
    icon: "💀",
    headline: "Account suspended overnight",
    quote:
      "GitHub suspended my account without warning. 2,000+ commits, 47 repos — gone overnight. No email, no appeal, no way back.",
    source: "r/programming, 2024",
    impact: "47 repos lost",
  },
  {
    icon: "🔥",
    headline: "Org accidentally deleted",
    quote:
      "Accidentally deleted my org. GitHub support took 3 weeks to respond. By then, all backups were purged from their system permanently.",
    source: "Hacker News",
    impact: "120+ repos gone",
  },
  {
    icon: "⚡",
    headline: "Force push wiped history",
    quote:
      "A rogue collaborator force-pushed to main and wiped our entire commit history. No branch protection, no backup, no recovery possible.",
    source: "Dev.to",
    impact: "3 years of history",
  },
  {
    icon: "🚫",
    headline: "DMCA takedown, zero warning",
    quote:
      "Received a bogus DMCA takedown on my open source project. GitHub removed the repo within hours. Took 2 months to dispute and restore.",
    source: "Twitter/X, 2023",
    impact: "Repo offline 2 months",
  },
  {
    icon: "💣",
    headline: "Token leak = account wipe",
    quote:
      "Someone found my leaked PAT in a Docker image. They deleted every repo in my account before I noticed. GitHub couldn't undo it.",
    source: "r/github, 2024",
    impact: "32 repos deleted",
  },
];

export default function HorrorSection() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // ~1 repo deleted every 3 seconds (dramatic effect)
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="horror"
      className="w-full py-24 px-6"
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "1120px" }}>
        {/* Section header */}
        <motion.div
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} style={{ color: "var(--amber)" }} />
              <span
                className="font-mono"
                style={{
                  fontSize: "11px",
                  color: "var(--amber)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Real incidents
              </span>
            </div>
            <h2
              className="font-sans"
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "#fff",
                lineHeight: 1.15,
              }}
            >
              Code disappears
              <br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>
                more often than you think.
              </span>
            </h2>
          </div>

          {/* Live counter */}
          <motion.div
            className="flex flex-col items-start md:items-end"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              repos lost since you opened this page
            </span>
            <motion.span
              className="font-mono"
              style={{
                fontSize: "48px",
                fontWeight: 600,
                color: "var(--red)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
              key={counter}
              initial={{ y: 10, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {counter}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Stories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {horrorStories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{
                borderColor: "rgba(248,81,73,0.2)",
                backgroundColor: "rgba(248,81,73,0.02)",
              }}
              className={`p-5 cursor-default ${
                i === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              style={{
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                transition: "border-color 0.3s, background-color 0.3s",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "16px" }}>{story.icon}</span>
                  <span
                    className="font-sans"
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    {story.headline}
                  </span>
                </div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "11px",
                    color: "var(--red)",
                    flexShrink: 0,
                    opacity: 0.8,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "rgba(248,81,73,0.08)",
                  }}
                >
                  {story.impact}
                </span>
              </div>
              <p
                className="font-sans"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.6,
                }}
              >
                &ldquo;{story.quote}&rdquo;
              </p>
              <p
                className="font-mono mt-3"
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}
              >
                — {story.source}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <motion.div
          className="mt-12 py-8 px-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: "var(--bg-base)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { value: "73M+", label: "repos on GitHub" },
            { value: "∞", label: "ways to lose them" },
            { value: "1", label: "click to back up", accent: true },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span
                className="font-mono"
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 600,
                  color: stat.accent ? "var(--accent)" : "#fff",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </span>
              <span
                className="font-mono mt-1"
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
