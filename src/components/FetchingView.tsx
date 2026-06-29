"use client";

import { motion } from "framer-motion";
import TerminalLog, { type LogLine } from "./TerminalLog";

interface FetchingViewProps {
  logs: LogLine[];
  repoCount: number;
  progress: number;
  onAddToken?: () => void;
  showRateLimitAction?: boolean;
}

export default function FetchingView({
  logs,
  repoCount,
  progress,
}: FetchingViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[560px] p-6"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
    >
      {/* Status */}
      <div className="mb-4 flex items-baseline justify-between">
        <p
          className="font-sans"
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#fff",
          }}
        >
          scanning repositories...
        </p>
        <span
          className="font-mono"
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {repoCount} found
        </span>
      </div>

      {/* Terminal */}
      <TerminalLog
        lines={logs}
        showCursor={true}
        progress={progress}
        counterText={`${repoCount} / ? repos`}
      />

      {/* Cancel hint */}
      <p
        className="font-mono mt-4 text-center"
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.15)",
        }}
      >
        fetching directly from github api — no middleman
      </p>
    </motion.div>
  );
}
