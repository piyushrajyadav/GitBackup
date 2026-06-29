import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitBackup — Download all your GitHub repos as a ZIP",
  description:
    "Backup your entire GitHub account in one click. All repos, one ZIP, nothing stored. No servers, no tracking. Your code stays yours.",
  keywords: [
    "github backup",
    "download github repos",
    "github zip download",
    "repository backup",
    "code backup",
    "git backup tool",
  ],
  openGraph: {
    title: "GitBackup — Your code deserves a backup plan",
    description:
      "Download all your GitHub repositories as a single ZIP. Zero servers. Zero tracking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrains.variable}`}>
      <body className="font-[var(--font-geist-sans)]">{children}</body>
    </html>
  );
}
