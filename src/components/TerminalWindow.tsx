"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  text: string;
  color: string;
  type: "command" | "output" | "success" | "info" | "final";
  delay?: number;
}

const sequence: TerminalLine[] = [
  { text: "$ gitbackup piyushrajyadav", color: "rgba(255,255,255,0.9)", type: "command" },
  { text: "→ fetching repos...", color: "#4D9EFF", type: "info", delay: 800 },
  { text: "✓ dropfade              public", color: "#3FB950", type: "success", delay: 400 },
  { text: "✓ sentinelflow          public", color: "#3FB950", type: "success", delay: 300 },
  { text: "✓ ooum-ai              [private]", color: "#D29922", type: "success", delay: 300 },
  { text: "✓ trading-bot           public", color: "#3FB950", type: "success", delay: 300 },
  { text: "✓ lumiy-os              public", color: "#3FB950", type: "success", delay: 300 },
  { text: "✓ gitbackup             public", color: "#3FB950", type: "success", delay: 300 },
  { text: "... 18 more", color: "rgba(255,255,255,0.3)", type: "output", delay: 400 },
  { text: "→ building zip archive...", color: "#4D9EFF", type: "info", delay: 600 },
  { text: "→ 24 repos · 142 MB · done ✓", color: "#3FB950", type: "success", delay: 800 },
  { text: "📦 piyushrajyadav_backup.zip", color: "#FFFFFF", type: "final", delay: 400 },
  { text: "downloaded to ~/Downloads", color: "rgba(255,255,255,0.4)", type: "output", delay: 300 },
];

export default function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let lineIndex = 0;
    let timeout: NodeJS.Timeout;

    const showNextLine = () => {
      if (lineIndex < sequence.length) {
        setVisibleLines(lineIndex + 1);
        const currentLine = sequence[lineIndex];
        const nextDelay = currentLine.delay || 400;
        lineIndex++;
        timeout = setTimeout(showNextLine, nextDelay);
      } else {
        setIsComplete(true);
        // Wait 2 seconds then restart
        timeout = setTimeout(() => {
          setVisibleLines(0);
          setIsComplete(false);
          lineIndex = 0;
          showNextLine();
        }, 2000);
      }
    };

    // Start sequence after brief delay
    timeout = setTimeout(showNextLine, 500);

    return () => clearTimeout(timeout);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full rounded-lg overflow-hidden"
      style={{
        boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px rgba(0,0,0,0.6)",
        background: "#0A0C0F",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 h-8"
        style={{ background: "#111318" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span
          className="font-mono text-[11px] absolute left-1/2 -translate-x-1/2"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          gitbackup — zsh
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-[13px] leading-relaxed min-h-[320px] md:min-h-[360px]">
        <AnimatePresence mode="sync">
          {sequence.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              style={{
                color: line.color,
                fontWeight: line.type === "final" ? 600 : 400,
              }}
              className={line.type === "final" ? "mt-1" : ""}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Cursor */}
        {isComplete && (
          <div className="flex items-center mt-1">
            <span className="text-white">$</span>
            <span
              className="inline-block w-2 h-4 ml-1"
              style={{
                background: showCursor ? "#4D9EFF" : "transparent",
                transition: "background 0.1s",
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
