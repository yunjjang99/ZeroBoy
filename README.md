🦾 ZeroBoy

ZeroBoy is a desktop application designed for automated cryptocurrency futures trading, focused on arbitrage opportunities and bidirectional hedging strategies.
It includes built-in mechanisms to bypass centralized exchange bot detection through advanced browser fingerprint spoofing and Cloudflare bot challenge evasion.

⸻

🧠 Overview

ZeroBoy enables safe and stealthy execution of automated trading strategies on centralized exchanges (CEXs).
It combines market-neutral techniques like hedging with deep system-level tactics to evade anti-bot systems and ensure maximum operational freedom.

⸻

🚀 Key Features
• ✅ Automated Crypto Futures Trading
• Supports long/short entries with pre-configured risk/return logic
• Automatically manages entry/exit timing and profit targets
• 🔁 Bidirectional Hedging Engine
• Simultaneous long & short positions for neutral exposure
• Designed to minimize risk in volatile markets
• 🛡 Browser Fingerprint Spoofing
• Randomized spoofing of user agent, GPU model, WebGL, Canvas, timezone, and more
• Thousands of unique identity combinations generated dynamically
• 🌐 Cloudflare and Bot Protection Bypass
• Uses Puppeteer with Stealth plugins to pass anti-bot challenges
• Simulates real user behavior and browser characteristics
• 💾 Lightweight Local Database
• SQLite-based storage for fast, embedded data handling
• Stores browser sessions, trade history, and fingerprint metadata
• 🖥 Cross-Platform Desktop App
• Built with React + Electron
• Windows and macOS packaging planned

⸻

🧱 Tech Stack

Layer Technology
Backend NestJS
Frontend React, Electron
Automation Puppeteer, Stealth
Database SQLite (local embedded DB)

⸻

🛠 Architecture

┌────────────┐ ┌────────────┐
│ Electron │◀────▶│ React GUI │
└────────────┘ └────────────┘
▲ ▲
│ │
┌────────────┐ ┌───────────────┐
│ Puppeteer │◀────▶│ NestJS Backend │
└────────────┘ └───────────────┘
▼
┌────────────┐
│ SQLite DB │
└────────────┘

⸻

🔒 Security & Stealth Mechanisms
• UUID-based browser session identity for reliable state management
• Seamless session persistence (cookies, localStorage, sessionStorage)
• Multi-layered fingerprint spoofing: randomized at launch
• Simulates Korean user environments (geolocation, language, timezone, etc.)
• Supports IP/region masking for advanced stealth

⸻

📦 Distribution

ZeroBoy is distributed as a standalone desktop application:
• ✅ Electron-based packaging
• ✅ Windows .exe and macOS .dmg supported
• 🔄 Auto-updater functionality planned

⸻

📌 Roadmap
• Telegram/Discord notification integration
• Multi-exchange arbitrage (Binance, Bybit, etc.)
• Distributed proxy routing support
• Real-time funding fee arbitrage logic
• Dark mode and enhanced UI
