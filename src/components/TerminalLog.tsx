"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";

export interface LogLine {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "private" | "error" | "rate_limit" | "done";
}

interface TerminalLogProps {
  lines: LogLine[];
  showCursor?: boolean;
  progress?: number; // 0 to 100
  counterText?: string;
}

export default function TerminalLog({
  lines,
  showCursor = true,
  progress,
  counterText,
}: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const getLineColor = (type: LogLine["type"]) => {
    switch (type) {
      case "info":
        return "rgba(255,255,255,0.4)";
      case "success":
        return "#fff";
      case "private":
        return "#D29922";
      case "error":
        return "#F85149";
      case "rate_limit":
        return "#D29922";
      case "done":
        return "#4ADE80";
      default:
        return "rgba(255,255,255,0.4)";
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--bg-inset)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
      }}
    >
      {counterText && (
        <div
          className="absolute top-0 right-0 px-3 py-2 font-mono"
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
            zIndex: 2,
          }}
        >
          {counterText}
        </div>
      )}
      <div
        ref={scrollRef}
        className="overflow-y-auto p-4"
        style={{ maxHeight: "320px", minHeight: "200px" }}
      >
        <AnimatePresence mode="popLayout">
          {lines.map((line, i) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="flex items-start gap-3 font-mono"
              style={{ fontSize: "13px", lineHeight: "24px" }}
            >
              <span style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                [{line.timestamp}]
              </span>
              <span style={{ color: getLineColor(line.type) }}>
                {line.type === "rate_limit" && "⚠ "}
                {line.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {showCursor && (
          <div className="flex items-center gap-3 font-mono" style={{ fontSize: "13px", lineHeight: "24px" }}>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span
              className="terminal-cursor inline-block"
              style={{
                width: "7px",
                height: "15px",
                background: "var(--accent)",
              }}
            />
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div
          className="w-full"
          style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
        >
          <motion.div
            className="h-full"
            style={{
              background: "linear-gradient(90deg, #4D9EFF, #7BB8FF)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}
    </div>
  );
}
