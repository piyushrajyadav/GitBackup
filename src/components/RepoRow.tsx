"use client";

import { motion } from "framer-motion";
import { Lock, Star } from "lucide-react";
import { getLangColor } from "@/lib/langColors";
import type { GitHubRepo } from "@/lib/github";

interface RepoRowProps {
  repo: GitHubRepo;
  index: number;
}

function formatSize(sizeKB: number): string {
  if (sizeKB < 1024) return `${sizeKB} KB`;
  if (sizeKB < 1024 * 1024) return `${(sizeKB / 1024).toFixed(1)} MB`;
  return `${(sizeKB / (1024 * 1024)).toFixed(1)} GB`;
}

export default function RepoRow({ repo, index }: RepoRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      className="flex items-center justify-between px-3 py-2 font-mono"
      style={{
        fontSize: "13px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: "default",
        borderRadius: "2px",
      }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {repo.private && (
          <Lock
            size={12}
            style={{ color: "var(--amber)", flexShrink: 0 }}
          />
        )}
        <span className="truncate" style={{ color: "#fff" }}>
          {repo.name}
        </span>
      </div>
      <div className="flex items-center gap-4" style={{ flexShrink: 0 }}>
        {repo.language && (
          <span
            className="flex items-center gap-1.5"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <span
              className="inline-block rounded-full"
              style={{
                width: "8px",
                height: "8px",
                background: getLangColor(repo.language),
              }}
            />
            <span style={{ fontSize: "11px" }}>{repo.language}</span>
          </span>
        )}
        <span
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "11px",
            minWidth: "52px",
            textAlign: "right",
          }}
        >
          {formatSize(repo.size)}
        </span>
        {repo.stargazers_count > 0 && (
          <span
            className="flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}
          >
            <Star size={11} />
            {repo.stargazers_count}
          </span>
        )}
      </div>
    </motion.div>
  );
}
