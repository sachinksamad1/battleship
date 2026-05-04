# ⚓ Battleship Web Game

A modern, open-source implementation of the classic Battleship game built with SvelteKit and Socket.IO. Play against AI opponents or challenge friends in real-time multiplayer matches.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with SvelteKit](https://img.shields.io/badge/built%20with-SvelteKit-orange.svg)](https://kit.svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎮 Features

### Core Gameplay
- **Classic Rules** — Authentic Battleship experience with standard 10×10 grid and 5-ship fleet
- **Ship Placement** — Drag-and-drop ship positioning with validation
- **Turn-Based Combat** — Strategic attack system with hit/miss detection

### Game Modes
- **Single Player** — Challenge AI opponents with 4 difficulty levels:
  - 🟢 Easy — Random targeting
  - 🟡 Medium — Hunt mode after successful hits
  - 🟠 Hard — Probability density targeting
  - 🔴 Expert — Predictive algorithms
- **Multiplayer** — Real-time matches via Socket.IO
  - Create private rooms
  - Share join codes
  - Live attack synchronization

### User Experience
- 📱 **Responsive Design** — Play on desktop, tablet, or mobile
- 🎨 **Smooth Animations** — Svelte transitions for hits, misses, and sink effects
- 🔊 **Sound Effects** — Audio feedback using Howler.js
- 🎯 **Visual Feedback** — Clear indicators for ship status and game state

---

## 🛠 Tech Stack

### Frontend
- [SvelteKit](https://kit.svelte.dev) — Full-stack web framework
- [TypeScript](https://www.typescriptlang.org) — Type-safe development
- [Tailwind CSS](https://tailwindcss.com) — Utility-first styling
- [svelte-dnd-action](https://github.com/rasberik/svelte-dnd-action) — Drag and drop
- [Howler.js](https://howlerjs.com) — Audio management

### Backend
- [Node.js](https://nodejs.org) — Runtime
- [Socket.IO](https://socket.io) — Real-time communication
- [TypeScript](https://www.typescriptlang.org) — Server-side type safety

### Testing & Tools
- [Vitest](https://vitest.dev) — Unit and integration testing
- [Svelte Stores](https://svelte.dev/docs/svelte/stores) — State management

### Deployment
- **Frontend:** [Vercel](https://vercel.com)
- **Backend:** [Railway](https://railway.app)

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/battleship.git
cd battleship

# Install dependencies
npm install

# Start development servers
npm run dev
```

Visit `http://localhost:5173` to start playing!

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or pnpm

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/battleship.git
   cd battleship
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 💻 Development

### Project Structure

```
battleship/
├── src/
│   ├── routes/              # SvelteKit pages
│   │   ├── +page.svelte     # Home page
│   │   ├── singleplayer/    # Single player mode
│   │   ├── multiplayer/     # Multiplayer mode
│   │   └── settings/        # Game settings
│   ├── lib/
│   │   ├── components/      # UI components
│   │   │   ├── board/       # Game board components
│   │   │   ├── ship/        # Ship components
│   │   │   ├── ui/          # Reusable UI elements
│   │   │   ├── overlays/    # Modal/overlay components
│   │   │   └── effects/     # Visual effects
│   │   ├── game/            # Game logic
│   │   │   ├── engine/      # Core game engine
│   │   │   ├── ai/          # AI opponents
│   │   │   ├── rules/       # Game rules
│   │   │   ├── models/      # Data models
│   │   │   └── utils/       # Utilities
│   │   ├── stores/          # Svelte stores
│   │   ├── socket/          # Socket.IO client
│   │   ├── audio/           # Sound management
│   │   ├── animations/      # Animation utilities
│   │   └── config/          # Configuration
│   ├── static/              # Static assets
│   └── tests/               # Test files
├── server/                  # Backend server
│   ├── src/
│   │   ├── rooms/           # Room management
│   │   ├── game/            # Server game logic
│   │   └── socket/          # Socket handlers
│   └── ...
├── docs/                    # Documentation
├── reference/               # Design documents
└── ...
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development servers (frontend + backend) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |
| `npm run check` | TypeScript type checking |

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- src/lib/game/engine/attack.test.ts
```

### Test Structure
- **Unit Tests** — Game engine, AI logic, validation
- **Integration Tests** — Multiplayer synchronization
- **UI Tests** — Component rendering and interaction

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Connect to Vercel
vercel

# Deploy to production
vercel --prod
```

### Backend (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

See [docs/guides/deployment.md](docs/guides/deployment.md) for detailed instructions.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Quick Start](docs/getting-started/quickstart.md) | Get up and running quickly |
| [Installation](docs/getting-started/installation.md) | Detailed installation guide |
| [Configuration](docs/getting-started/configuration.md) | Environment variables and settings |
| [System Design](docs/architecture/system-design.md) | Architecture overview |
| [API Specification](reference/api-spec.md) | Socket.IO event protocol |
| [Data Models](reference/data-models.md) | TypeScript type definitions |
| [Testing Guide](docs/guides/testing.md) | Writing and running tests |
| [Deployment](docs/guides/deployment.md) | Production deployment |

### Reference Documents
- [Product Requirements](reference/prd.md) — PRD and feature specifications
- [Architecture Design](reference/architecture.md) — System architecture
- [Tech Stack](reference/tech-stack.md) — Technology decisions
- [Game Rules](reference/summary.md) — Classic Battleship rules

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Classic Battleship game by Milton Bradley (1967)
- [SvelteKit](https://kit.svelte.dev) team for the amazing framework
- [Socket.IO](https://socket.io) for real-time communication
- All open source contributors and maintainers

---

## 📬 Contact

- **Issues:** [GitHub Issues](https://github.com/yourusername/battleship/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/battleship/discussions)

---

<div align="center">
  <p>Built with ❤️ by SACHIN K SAMAD for the open source community</p>
  <p>
    ⭐ Star this repo if you find it useful!
  </p>
</div>
