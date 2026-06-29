"use client";

import { motion } from "framer-motion";
import { getLangColor } from "@/lib/langColors";
import type { GitHubRepo } from "@/lib/github";
import { useState } from "react";

interface LanguageBarProps {
  repos: GitHubRepo[];
}

interface LangStat {
  language: string;
  count: number;
  percent: number;
  color: string;
}

export default function LanguageBar({ repos }: LanguageBarProps) {
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  const langCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  }

  const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
  const stats: LangStat[] = Object.entries(langCounts)
    .map(([language, count]) => ({
      language,
      count,
      percent: (count / total) * 100,
      color: getLangColor(language),
    }))
    .sort((a, b) => b.count - a.count);

  if (stats.length === 0) return null;

  return (
    <div className="w-full">
      <div
        className="w-full flex overflow-hidden"
        style={{ height: "4px", borderRadius: "2px", gap: "1px" }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.language}
            initial={{ width: 0 }}
            animate={{ width: `${stat.percent}%` }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            className="h-full relative cursor-default"
            style={{
              background: stat.color,
              minWidth: stat.percent > 0.5 ? "3px" : "1px",
            }}
            onHoverStart={() => setHoveredLang(stat.language)}
            onHoverEnd={() => setHoveredLang(null)}
          />
        ))}
      </div>
      <div
        className="flex flex-wrap gap-3 mt-3"
        style={{ fontSize: "11px" }}
      >
        {stats.slice(0, 8).map((stat) => (
          <motion.span
            key={stat.language}
            className="flex items-center gap-1.5 font-mono cursor-default"
            animate={{
              opacity: hoveredLang === null || hoveredLang === stat.language ? 1 : 0.3,
            }}
            transition={{ duration: 0.15 }}
            onHoverStart={() => setHoveredLang(stat.language)}
            onHoverEnd={() => setHoveredLang(null)}
          >
            <span
              className="inline-block rounded-full"
              style={{
                width: "6px",
                height: "6px",
                background: stat.color,
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.5)" }}>
              {stat.language}
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>
              {stat.percent.toFixed(0)}%
            </span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}
