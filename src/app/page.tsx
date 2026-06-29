"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HorrorSection from "@/components/HorrorSection";
import HowItWorks from "@/components/HowItWorks";
import RoastGitHub from "@/components/RoastGitHub";
import FAQ from "@/components/FAQ";

import InputView from "@/components/InputView";
import FetchingView from "@/components/FetchingView";
import ReadyView from "@/components/ReadyView";
import CloudModal from "@/components/CloudModal";

import { fetchAllRepos } from "@/lib/github";
import type { GitHubRepo, FetchProgress } from "@/lib/github";
import type { CloudProvider } from "@/lib/cloudUpload";
import type { LogLine } from "@/components/TerminalLog";

type AppState = "input" | "fetching" | "ready";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("input");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetching state
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [fetchProgress, setFetchProgress] = useState(0);

  // Download state
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  // Cloud modal
  const [cloudProvider, setCloudProvider] = useState<CloudProvider | null>(null);

  const handleSubmit = useCallback(async (user: string, tok: string | null) => {
    setUsername(user);
    setToken(tok);
    setError(null);
    setLogs([]);
    setFetchProgress(0);
    setRepos([]);
    setAppState("fetching");

    let logCounter = 0;

    try {
      const allRepos = await fetchAllRepos(user, tok, (p: FetchProgress) => {
        const logLine: LogLine = {
          id: `log-${logCounter++}`,
          timestamp: p.timestamp,
          message: p.message,
          type:
            p.type === "page"
              ? "info"
              : p.type === "repo"
              ? p.repo?.private
                ? "private"
                : "success"
              : p.type === "rate_limit"
              ? "rate_limit"
              : p.type === "error"
              ? "error"
              : p.type === "done"
              ? "done"
              : "info",
        };
        setLogs((prev) => [...prev, logLine]);

        if (p.type === "repo") {
          setRepos((prev) => {
            const next = [...prev, p.repo!];
            // Estimate progress based on pages (rough heuristic)
            setFetchProgress(Math.min(90, next.length * 3));
            return next;
          });
        }
      });

      if (allRepos.length === 0) {
        setError(`no public repositories found for "${user}"`);
        setAppState("input");
        return;
      }

      setRepos(allRepos);
      setFetchProgress(100);

      // Brief pause for animation
      await new Promise((r) => setTimeout(r, 600));
      setAppState("ready");
    } catch {
      setError("failed to fetch repositories. check the username and try again.");
      setAppState("input");
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (repos.length === 0) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    const zip = new JSZip();
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i];
      const repoFolder = zip.folder(repo.name);
      
      try {
        // Try to download actual repo archive
        const headers: HeadersInit = {
          Accept: "application/vnd.github.v3+json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // Use GitHub API to get tarball
        const tarballUrl = `https://api.github.com/repos/${repo.full_name}/tarball/${repo.default_branch}`;
        
        try {
          const response = await fetch(tarballUrl, { 
            headers,
            redirect: 'follow'
          });

          if (response.ok) {
            const blob = await response.blob();
            // Add the tarball to the zip
            repoFolder!.file(`${repo.name}.tar.gz`, blob);
            successCount++;
          } else {
            throw new Error("Failed to download archive");
          }
        } catch (archiveError) {
          // Fallback: Create metadata file
          const metadata = `# ${repo.name}

Repository: ${repo.html_url}
Description: ${repo.description || "No description"}
Language: ${repo.language || "Unknown"}
Stars: ${repo.stargazers_count}
Last Updated: ${new Date(repo.updated_at).toLocaleDateString()}
Default Branch: ${repo.default_branch}
Private: ${repo.private ? "Yes" : "No"}
Fork: ${repo.fork ? "Yes" : "No"}

---

## Clone Instructions

To clone this repository locally:

\`\`\`bash
git clone ${repo.html_url}.git
\`\`\`

Or download directly:
${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip
`;
          
          repoFolder!.file("REPO_INFO.md", metadata);
          
          // Add a download link file
          const downloadLink = `[InternetShortcut]
URL=${repo.html_url}
`;
          repoFolder!.file("OPEN_ON_GITHUB.url", downloadLink);
          failCount++;
        }
        
      } catch (err) {
        console.error(`Failed to process ${repo.name}:`, err);
        failCount++;
      }
      
      setDownloadProgress(Math.round(((i + 1) / repos.length) * 100));
    }

    // Add a master README
    const masterReadme = `# GitHub Backup - ${username}

This backup contains ${repos.length} repositories from ${username}'s GitHub profile.

Generated: ${new Date().toLocaleString()}

## Download Summary

- ✅ Successfully downloaded: ${successCount} repositories (as .tar.gz archives)
- ℹ️  Metadata only: ${failCount} repositories (see REPO_INFO.md for clone instructions)

## Repositories Included

${repos.map(r => `- **${r.name}** ${r.private ? '(Private)' : ''} - ${r.description || 'No description'}
  - URL: ${r.html_url}
  - Language: ${r.language || 'Unknown'}
  - Stars: ${r.stargazers_count}
`).join('\n')}

## How to Extract Archives

Each repository folder may contain a \`.tar.gz\` file with the complete source code.

### On Windows (using 7-Zip or WinRAR):
1. Right-click the .tar.gz file
2. Extract twice (first .gz, then .tar)

### On macOS/Linux:
\`\`\`bash
tar -xzf repository-name.tar.gz
\`\`\`

For repositories with only metadata files, use the clone instructions in REPO_INFO.md.

---

Generated by GitBackup - https://gitbackup.dev
`;
    
    zip.file("README.md", masterReadme);

    const blob = await zip.generateAsync({ type: "blob" });
    setZipBlob(blob);
    saveAs(blob, `${username}-github-backup.zip`);
    setIsDownloading(false);
    setDownloadComplete(true);
  }, [repos, token, username]);

  const handleCloudSave = useCallback((provider: CloudProvider) => {
    setCloudProvider(provider);
  }, []);

  const handleCloudSuccess = useCallback(() => {
    setDownloadComplete(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-[rgb(var(--background))]">
      {/* ── Hero Section ── */}
      <HeroSection />

      {/* ── Section Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-0" />

      {/* ── Backup Tool Card Section ── */}
      <section id="tool" className="relative py-32 px-6 min-h-screen flex items-center">
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        
        {/* Gradient glow effect */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "600px",
            height: "600px",
            opacity: 0.3,
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Live · No signup required</span>
            </div>
            
            <h2
              className="text-5xl md:text-6xl font-bold mb-4"
              style={{
                fontFamily: "'General Sans', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "rgb(var(--foreground))" }}>Download </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(to left, #6366f1, #a855f7)",
                }}
              >
                any GitHub profile
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Back up your repos, study code offline, or archive developer profiles.
              <br className="hidden md:block" />
              Everything runs in your browser. Zero servers. Zero tracking.
            </p>
          </motion.div>

          <div className="relative flex justify-center">
            <AnimatePresence mode="wait">
              {appState === "input" && (
                <InputView
                  key="input"
                  onSubmit={handleSubmit}
                  error={error}
                />
              )}
              {appState === "fetching" && (
                <FetchingView
                  key="fetching"
                  logs={logs}
                  repoCount={repos.length}
                  progress={fetchProgress}
                />
              )}
              {appState === "ready" && (
                <ReadyView
                  key="ready"
                  repos={repos}
                  onDownload={handleDownload}
                  onCloudSave={handleCloudSave}
                  isDownloading={isDownloading}
                  downloadProgress={downloadProgress}
                  downloadComplete={downloadComplete}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Features Spec Sheet ── */}
      <FeaturesSection />

      {/* ── Horror Stories ── */}
      <HorrorSection />

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── Roast GitHub ── */}
      <RoastGitHub />

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── Cloud Modal ── */}
      <AnimatePresence>
        {cloudProvider && (
          <CloudModal
            key="cloud-modal"
            provider={cloudProvider}
            zipBlob={zipBlob}
            onClose={() => setCloudProvider(null)}
            onSuccess={handleCloudSuccess}
          />
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <footer
        className="w-full py-12 px-6"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg-base)" }}
      >
        <div
          className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ maxWidth: "1120px" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-mono"
              style={{ color: "var(--accent)", fontSize: "16px", fontWeight: 600 }}
            >
              gb/
            </span>
            <span
              className="font-mono"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}
            >
              0 servers. 0 tracking. 0 bs.
            </span>
          </div>
          <p
            className="font-sans text-center sm:text-right"
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            © {new Date().getFullYear()} GitBackup. Released under MIT License.
          </p>
        </div>
      </footer>
    </main>
  );
}
