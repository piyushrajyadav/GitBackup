"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Loader2, Sparkles } from "lucide-react";

interface RoastLine {
  text: string;
  severity: "mild" | "medium" | "spicy";
}

export default function RoastGitHub() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roasts, setRoasts] = useState<RoastLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aiPowered, setAiPowered] = useState(false);

  const generateAIRoast = async (repos: any[], username: string): Promise<string[]> => {
    const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      return generateFallbackRoasts(repos);
    }

    try {
      // Prepare repo data for AI
      const repoSummary = {
        totalRepos: repos.length,
        forkedRepos: repos.filter(r => r.fork).length,
        emptyRepos: repos.filter(r => r.size === 0).length,
        totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
        languages: [...new Set(repos.filter(r => r.language).map(r => r.language))],
        oldRepos: repos.filter(r => {
          const daysSinceUpdate = (Date.now() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceUpdate > 365;
        }).length,
        noDescRepos: repos.filter(r => !r.description).length,
        topRepos: repos.slice(0, 5).map(r => ({
          name: r.name,
          stars: r.stargazers_count,
          language: r.language,
          description: r.description
        }))
      };

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: "You are a witty, sarcastic developer who roasts GitHub profiles. Generate 5-6 funny, clever roasts based on the user's GitHub stats. Be humorous but not mean-spirited. Mix gentle jokes with harder burns. Each roast should be one sentence, max 25 words. Return ONLY the roasts, one per line, no numbering."
            },
            {
              role: "user",
              content: `Roast @${username}'s GitHub profile based on these stats: ${JSON.stringify(repoSummary)}`
            }
          ],
          temperature: 0.9,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = await response.json();
      const roastText = data.choices[0]?.message?.content || "";
      const roastLines = roastText.split("\n").filter((line: string) => line.trim().length > 0);
      
      setAiPowered(true);
      return roastLines;
    } catch (err) {
      console.error("AI roast failed, using fallback:", err);
      return generateFallbackRoasts(repos);
    }
  };

  const generateFallbackRoasts = (repos: any[]): string[] => {
    const roastLines: string[] = [];

    const totalRepos = repos.length;
    const forkedRepos = repos.filter(r => r.fork).length;
    const emptyRepos = repos.filter(r => r.size === 0).length;
    const oldRepos = repos.filter(r => {
      const daysSinceUpdate = (Date.now() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate > 365;
    }).length;
    const noDescRepos = repos.filter(r => !r.description).length;
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    if (totalRepos === 0) {
      roastLines.push("Empty profile. Are you even a developer? 💀");
    } else if (totalRepos < 5) {
      roastLines.push(`Only ${totalRepos} repos? My calculator has more projects.`);
    } else if (totalRepos > 100) {
      roastLines.push(`${totalRepos} repos? Quality over quantity, my friend.`);
    }

    if (forkedRepos > totalRepos * 0.7) {
      roastLines.push("90% forked repos. Ctrl+C much? 🔄");
    } else if (forkedRepos > totalRepos * 0.4) {
      roastLines.push("More forks than a cutlery drawer.");
    }

    if (emptyRepos > 3) {
      roastLines.push(`${emptyRepos} empty repos. Are they for 'future projects'? 👻`);
    }

    if (oldRepos > totalRepos * 0.5) {
      roastLines.push("Half your repos haven't been touched in over a year. GitHub graveyard.");
    }

    if (noDescRepos > totalRepos * 0.6) {
      roastLines.push("No descriptions? Let me guess... 'test', 'new-project', 'untitled'?");
    }

    if (totalStars === 0 && totalRepos > 5) {
      roastLines.push("Not a single star. Even your mom didn't star your repos. ⭐️");
    }

    if (roastLines.length < 3) {
      roastLines.push("Actually... not bad. Keep it up! 🔥");
    }

    return roastLines.slice(0, 6);
  };

  const classifyRoast = (text: string): "mild" | "medium" | "spicy" => {
    const spicyWords = ["ouch", "brutal", "💀", "disaster", "terrible", "awful", "pathetic"];
    const mildWords = ["not bad", "keep it up", "solid", "decent", "✨"];
    
    const lowerText = text.toLowerCase();
    
    if (spicyWords.some(word => lowerText.includes(word))) return "spicy";
    if (mildWords.some(word => lowerText.includes(word))) return "mild";
    return "medium";
  };

  const handleRoast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError(null);
    setRoasts([]);
    setAiPowered(false);

    try {
      const res = await fetch(`https://api.github.com/users/${username.trim()}/repos?per_page=100`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("User not found. Check the username and try again.");
        } else {
          setError("Failed to fetch repos. Try again later.");
        }
        setIsLoading(false);
        return;
      }

      const repos = await res.json();
      
      // Get AI-powered roasts
      const roastTexts = await generateAIRoast(repos, username.trim());
      
      // Classify and animate roasts appearing one by one
      for (let i = 0; i < roastTexts.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setRoasts(prev => [...prev, {
          text: roastTexts[i],
          severity: classifyRoast(roastTexts[i])
        }]);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "rgba(74, 222, 128, 0.8)";
      case "medium": return "rgba(251, 191, 36, 0.8)";
      case "spicy": return "rgba(248, 113, 113, 0.8)";
      default: return "rgba(255, 255, 255, 0.8)";
    }
  };

  return (
    <section id="roast" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent" />
      
      <div className="relative max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium mb-6">
            <Flame className="w-4 h-4" />
            <span>AI-Powered Fun</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Roast Your GitHub
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Think your GitHub profile is impressive? Let our AI be the judge.
          </p>
        </motion.div>

        {/* Input form */}
        <motion.form
          onSubmit={handleRoast}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center rounded-xl border border-white/10 bg-[rgb(var(--card))] px-4 py-4">
              <svg className="w-5 h-5 text-white/40 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  Roast Me
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roasts */}
        <AnimatePresence mode="sync">
          {roasts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/10 bg-[rgb(var(--card))] p-8"
            >
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">
                      Roast Results for @{username}
                    </h3>
                    {aiPowered && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 text-xs">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-white/50">
                    {roasts.length} observations found
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {roasts.map((roast, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white/5"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: getSeverityColor(roast.severity) }}
                    />
                    <p className="text-white/80 leading-relaxed flex-1">
                      {roast.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-white/40">
                  It's all in good fun! 😄 Keep building awesome things.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
