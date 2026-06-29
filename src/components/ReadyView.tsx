"use client";

import { motion } from "framer-motion";
import { Download, Check } from "lucide-react";
import type { GitHubRepo } from "@/lib/github";
import type { CloudProvider } from "@/lib/cloudUpload";
import RepoRow from "./RepoRow";
import LanguageBar from "./LanguageBar";

interface ReadyViewProps {
  repos: GitHubRepo[];
  onDownload: () => void;
  onCloudSave: (provider: CloudProvider) => void;
  isDownloading: boolean;
  downloadProgress: number;
  downloadComplete: boolean;
}

function formatTotalSize(repos: GitHubRepo[]): string {
  const totalKB = repos.reduce((sum, r) => sum + r.size, 0);
  if (totalKB < 1024) return `${totalKB} KB`;
  if (totalKB < 1024 * 1024) return `~${(totalKB / 1024).toFixed(0)} MB`;
  return `~${(totalKB / (1024 * 1024)).toFixed(1)} GB`;
}

export default function ReadyView({
  repos,
  onDownload,
  onCloudSave,
  isDownloading,
  downloadProgress,
  downloadComplete,
}: ReadyViewProps) {
  const publicCount = repos.filter((r) => !r.private).length;
  const privateCount = repos.filter((r) => r.private).length;

  const cloudProviders: {
    id: CloudProvider;
    name: string;
    borderColor: string;
  }[] = [
    { id: "s3", name: "AWS S3", borderColor: "#FF9900" },
    { id: "gcs", name: "Google Cloud", borderColor: "#4285F4" },
    { id: "azure", name: "Azure", borderColor: "#0078D4" },
  ];

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
      {/* Stats header */}
      <motion.div layout className="mb-6">
        <div className="flex items-baseline gap-3">
          <span
            className="font-mono"
            style={{
              fontSize: "48px",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {repos.length}
          </span>
          <span
            className="font-sans"
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            repositories ready
          </span>
        </div>
        <p
          className="font-mono mt-2"
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {formatTotalSize(repos)}
          {publicCount > 0 && (
            <>
              <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.15)" }}>·</span>
              {publicCount} public
            </>
          )}
          {privateCount > 0 && (
            <>
              <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.15)" }}>·</span>
              {privateCount} private
            </>
          )}
        </p>
      </motion.div>

      {/* Language bar */}
      <div className="mb-6">
        <LanguageBar repos={repos} />
      </div>

      {/* Repo list */}
      <div
        className="overflow-y-auto mb-6"
        style={{
          maxHeight: "256px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
        }}
      >
        {repos.map((repo, i) => (
          <RepoRow key={repo.id} repo={repo} index={i} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        {/* Download button */}
        <motion.button
          onClick={onDownload}
          disabled={isDownloading || downloadComplete}
          className="w-full font-mono cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden"
          style={{
            fontSize: "13px",
            fontWeight: 500,
            background: downloadComplete ? "var(--success)" : "var(--accent)",
            color: "var(--bg-base)",
            border: "none",
            borderRadius: "4px",
            padding: "12px",
            opacity: isDownloading ? 0.8 : 1,
          }}
          whileHover={
            !isDownloading && !downloadComplete
              ? { filter: "brightness(1.1)", scale: 1.005 }
              : {}
          }
          whileTap={
            !isDownloading && !downloadComplete
              ? { scale: 0.995 }
              : {}
          }
        >
          {isDownloading && (
            <motion.div
              className="absolute left-0 top-0 h-full"
              style={{
                background: "rgba(0,0,0,0.15)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${downloadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {downloadComplete ? (
              <>
                <Check size={16} />
                downloaded
              </>
            ) : isDownloading ? (
              `zipping... ${downloadProgress}%`
            ) : (
              <>
                <Download size={16} />
                download .zip
              </>
            )}
          </span>
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div
            className="flex-1"
            style={{ height: "1px", background: "var(--border)" }}
          />
          <span
            className="font-mono"
            style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}
          >
            or save directly to
          </span>
          <div
            className="flex-1"
            style={{ height: "1px", background: "var(--border)" }}
          />
        </div>

        {/* Cloud buttons */}
        <div className="grid grid-cols-3 gap-2">
          {cloudProviders.map((provider) => (
            <motion.button
              key={provider.id}
              onClick={() => onCloudSave(provider.id)}
              className="font-mono cursor-pointer flex items-center justify-center"
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.6)",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderLeft: `2px solid ${provider.borderColor}`,
                borderRadius: "4px",
                padding: "10px 8px",
              }}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.9)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {provider.name}
            </motion.button>
          ))}
        </div>

        {/* Waitlist */}
        <motion.button
          className="w-full font-mono cursor-pointer"
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.3)",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "10px",
          }}
          whileHover={{
            borderColor: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.5)",
          }}
          whileTap={{ scale: 0.99 }}
        >
          GitBackup Cloud — join waitlist
        </motion.button>
      </div>
    </motion.div>
  );
}
