"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What does the downloaded ZIP contain?",
    answer: "The ZIP contains a folder for each repository with metadata files including repository information, clone instructions, and direct links. Due to GitHub API CORS restrictions, we provide comprehensive metadata and links to clone or download each repo manually.",
  },
  {
    question: "Why doesn't it download the actual code files?",
    answer: "GitHub's API has CORS (Cross-Origin Resource Sharing) restrictions that prevent direct file downloads from the browser. Instead, we provide you with organized metadata, clone URLs, and direct download links for each repository. This approach is instant and works for unlimited repos without rate limits.",
  },
  {
    question: "Is my GitHub token safe?",
    answer: "Yes, 100%. Everything runs entirely in your browser. Your token is never sent to any server - it's only used to make direct API calls to GitHub from your browser. You can verify this by checking the Network tab in your browser's developer tools.",
  },
  {
    question: "Can I access private repositories?",
    answer: "Yes! Add a Personal Access Token with 'repo' permissions. The token lets you see your private repos and generates the metadata and clone links for them. Your token is only stored in your browser's memory during the session.",
  },
  {
    question: "How do I actually clone the repositories?",
    answer: "Each repository folder contains a REPO_INFO.md file with the git clone command. Simply open your terminal, navigate to where you want the repo, and run the provided command. Or use the direct download link to get a ZIP from GitHub.",
  },
  {
    question: "Why use this instead of manually cloning?",
    answer: "This tool gives you an organized catalog of all repositories with metadata in seconds. Instead of manually visiting each repo page and copying URLs, you get a structured backup with all information in one place - perfect for documentation, auditing, or planning bulk operations.",
  },
  {
    question: "Does this work with GitHub Enterprise?",
    answer: "Currently, GitBackup only works with github.com. GitHub Enterprise support would require custom API endpoint configuration, which isn't implemented yet.",
  },
  {
    question: "Is this really free?",
    answer: "Yes, completely free and open source. No hidden costs, no premium features, no subscriptions. The code is on GitHub if you want to verify or contribute.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      
      <div className="relative max-w-3xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Questions & Answers
          </h2>
          <p className="text-lg text-white/60">
            Everything you need to know about GitBackup
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left rounded-xl border border-white/10 bg-[rgb(var(--card))] hover:border-white/20 transition-all p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-white/60 transition-transform flex-shrink-0 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-white/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center p-8 rounded-2xl border border-white/10 bg-[rgb(var(--card))]"
        >
          <p className="text-white/60 mb-4">
            Still have questions?
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Open an issue on GitHub
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
