"use client";

import { Database, Globe, Shield, Code, GitBranch } from "lucide-react";

const items = [
  { icon: <Database size={13} />, text: "12,847 developers backed up" },
  { icon: <Globe size={13} />, text: "4.2M repos saved" },
  { icon: <Shield size={13} />, text: "0 bytes stored on our servers" },
  { icon: <Code size={13} />, text: "100% open source" },
  { icon: <GitBranch size={13} />, text: "Supports private repos" },
  { icon: <Database size={13} />, text: "12,847 developers backed up" },
  { icon: <Globe size={13} />, text: "4.2M repos saved" },
  { icon: <Shield size={13} />, text: "0 bytes stored on our servers" },
  { icon: <Code size={13} />, text: "100% open source" },
  { icon: <GitBranch size={13} />, text: "Supports private repos" },
];

export default function MarqueeTicker() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 0",
      }}
    >
      <div className="marquee-track flex items-center gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 font-mono"
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "rgba(77,158,255,0.4)" }}>{item.icon}</span>
            {item.text}
            <span
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                marginLeft: "20px",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
