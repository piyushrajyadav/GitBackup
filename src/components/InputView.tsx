"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, ChevronRight } from "lucide-react";

interface InputViewProps {
  onSubmit: (username: string, token: string | null) => void;
  error: string | null;
}

export default function InputView({ onSubmit, error }: InputViewProps) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    onSubmit(username.trim(), token.trim() || null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Main card with liquid glass effect */}
        <div className="relative liquid-glass rounded-3xl p-8 md:p-12 backdrop-blur-xl">
          
          {/* Gradient border effect */}
          <div
            className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))",
            }}
          />
          
          <div className="relative space-y-6">
            {/* Username input */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                GitHub Username
              </label>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                  <svg className="w-5 h-5 text-white/30 group-focus-within:text-white/50 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="torvalds"
                  className="w-full pl-14 pr-5 py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder:text-white/30 text-base focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                  autoComplete="off"
                  spellCheck={false}
                />
                
                {/* Focus glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{
                  boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.1), 0 0 24px rgba(99, 102, 241, 0.2)"
                }} />
              </div>
              
              <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Enter any public GitHub username to get started
              </p>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm backdrop-blur-sm">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Token section */}
            <div className="pt-6 border-t border-white/10">
              <AnimatePresence mode="wait">
                {!showToken ? (
                  <motion.button
                    key="show"
                    type="button"
                    onClick={() => setShowToken(true)}
                    className="text-sm font-medium transition-colors flex items-center gap-2 group"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    <Lock className="w-4 h-4 group-hover:text-white/70 transition-colors" />
                    <span className="group-hover:text-white/70 transition-colors">
                      Add token for private repos
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ) : (
                  <motion.div
                    key="token"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <label
                      className="block text-sm font-semibold"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Personal Access Token (optional)
                    </label>
                    
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-white/30 font-mono text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                      autoComplete="off"
                    />
                    
                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "rgba(74, 222, 128, 0.8)" }}>
                      <Shield className="w-4 h-4" />
                      Your token never leaves your browser · 100% client-side
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Submit button with gradient */}
        <motion.button
          type="submit"
          disabled={!username.trim()}
          className="relative w-full px-8 py-6 rounded-2xl text-white font-bold text-lg transition-all overflow-hidden group disabled:opacity-40"
          style={{
            background: username.trim() 
              ? "linear-gradient(135deg, #6366f1, #a855f7)" 
              : "rgba(255,255,255,0.1)",
          }}
          whileHover={username.trim() ? { scale: 1.02 } : {}}
          whileTap={username.trim() ? { scale: 0.98 } : {}}
        >
          {/* Shine effect on hover */}
          {username.trim() && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transform: "translateX(-100%)",
                  animation: "shine 1.5s infinite",
                }}
              />
            </div>
          )}
          
          <span className="relative flex items-center justify-center gap-2">
            Download All Repos
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </form>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </motion.div>
  );
}
