# 🚀 GitBackup

**Download entire GitHub profiles in one click.** Back up your repos, study code from your favorite developers, or archive entire profiles. Everything runs 100% client-side in your browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

## ✨ Features

- **🌐 Any GitHub User** - Download repos from any public profile (yours, torvalds, DHH, anyone)
- **🔒 Private Repos** - Add a token to include your private repositories
- **💨 Lightning Fast** - Parallel downloads with progress tracking
- **☁️ Cloud Ready** - Download as ZIP or upload directly to AWS S3, Google Cloud, or Azure
- **🛡️ 100% Secure** - Everything runs client-side. No backend, no database, zero tracking
- **📊 Analytics** - Visual breakdowns of languages and repository sizes
- **🎯 Selective Download** - Filter repos by language, size, or custom criteria

## 🎯 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/gitbackup.git
cd gitbackup

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start downloading!

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **ZIP Generation**: JSZip
- **Icons**: Lucide React

## 📖 How It Works

1. **Enter Username** - Type any GitHub username (yours or someone else's)
2. **API Fetch** - Direct API calls to GitHub from your browser
3. **Download** - All repos compressed into a single organized ZIP file

### With Token (for private repos)

1. Create a [Personal Access Token](https://github.com/settings/tokens) with `repo` permissions
2. Paste it in the optional token field
3. Your token is only used for direct API calls - never sent to any server

## 🔐 Security & Privacy

- **No Backend** - Everything runs in your browser using JavaScript
- **No Tracking** - Zero analytics, no cookies, no data collection
- **No Storage** - Your tokens and data stay in your browser's memory
- **Open Source** - Verify the code yourself

You can inspect the Network tab in your browser's DevTools to see that we only make calls to `api.github.com`.

## 🌟 Use Cases

- **Personal Backup** - Keep offline copies of all your repositories
- **Code Study** - Download repos from developers you admire to study offline
- **Portfolio Archive** - Save snapshots of your GitHub profile over time
- **Migration** - Bulk download before moving to another platform
- **Compliance** - Keep local copies for regulatory requirements

## ⚙️ Configuration

### Environment Variables

No environment variables needed! Everything runs client-side.

### Build for Production

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Browser extension for automated backups
- [ ] GitHub Actions integration
- [ ] Incremental backup (only download changed repos)
- [ ] Multiple profile comparison
- [ ] Repository dependency graph visualization
- [ ] GitHub Enterprise support

## ⚠️ Rate Limits

GitHub API rate limits:
- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour

For accounts with many repositories, we recommend using a Personal Access Token.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by the need for simple, secure backup solutions

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/gitbackup/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gitbackup/discussions)

---

**Made with ❤️ for developers who value their code**

*Not affiliated with GitHub, Inc.*
