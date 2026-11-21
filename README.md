# GroqCloud™ Console Clone with Interactive Micro Slats & Pops

A pixel-perfect clone of the **GroqCloud™ Console** (`console.groq.com`) combined with the interactive **Micro Slats** perspective wave component from 21st.dev, featuring ultra-fast LPU inference streaming and spring pops.

## 🚀 Key Features

### 1. GroqCloud™ Console (`console.groq.com`)
- **Home**:
  - *Build Fast on Groq* banner with embedded interactive Micro Slats ambient wave.
  - *Token Usage* card with interactive 30-day sparkline chart.
  - *Unlock higher limits* dev tier upgrade modal with confetti pops.
  - *Quick access cards*: Playground, Documentation, and Team Management.
  - *The Models matrix*: Categorized overview for Reasoning, Text to Speech, Speech to Text, Vision, Function Calling, and Content Moderation.
  - *Google Workspace Connectors* announcement banner.
- **Playground**:
  - Interactive chat and studio modes.
  - Ultra-fast token streaming simulating Groq LPUs at **800+ tokens/second** with real-time TTFT and throughput counters.
  - Dynamic `</> View code` panel generating client calls in Python, cURL, and Node.js in real time.
  - Full parameters panel: Temperature, Max Completion Tokens, Reasoning Effort, Stream, JSON mode, Browser Search, and Code Interpreter.
- **Documentation**:
  - Search bar with `⌘K` shortcut.
  - Switcher for Docs and API Reference.
  - Detailed pages for *Overview* and *Responses API* (OpenAI compatibility).
  - "On this page" TOC and interactive feedback buttons.
- **Dashboard**:
  - Live interactive SVG metrics for HTTP Status Codes and Token breakdowns with rate limits.
  - Real-time API request logs table.
  - Asynchronous Batch Processing enablement screen.
- **API Keys**:
  - Manage keys (`gsk_...`), create keys, copy keys with confetti animation, and revoke keys.
- **Settings**:
  - Organization settings (`org_01kvav4dhyeaabncj51a2zye10`) and Profile settings for Bhavya M Sheth.

### 2. Micro Slats Dynamic Perspective Wave (21st.dev / UI Labs)
- **60 FPS Canvas Physics Engine**: Perspective matrix of micro-capsules simulating a rolling ocean sea with glinting white crests.
- **Mouse Reactivity**: Hovering over the grid dynamically warps elevations and ignites crest highlights.
- **Micro Slats Studio Modal**:
  - Presets: *Swell*, *Rolling Wave*, *Radial Pulse*, *Vortex*, and *Calm Ripple*.
  - Live color picker & palette presets (Cyber Violet `#a855f7`, Groq Speed Orange `#f55036`, Electric Emerald, Hyper Cyan).
  - Slat Width & Height sliders.
  - Code generator with "Copy for AI" button.

## 🛠 Tech Stack
- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations & Pops**: Canvas Confetti + Custom CSS Keyframes + 60fps Canvas 2D Engine

## 💻 Development Server

```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Production build
npm run build
```

Local server URL: [http://localhost:5173/](http://localhost:5173/)

