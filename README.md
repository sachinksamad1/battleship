# Battleship Web Game 🚢

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=flat-square&logo=pnpm)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.9.8-FF0087?logo=turborepo&logoColor=white)](https://turbo.build/)

A modern, web-based implementation of the classic Battleship game. Play against an advanced AI with multiple difficulty levels or challenge your friends in real-time multiplayer!

## 🌟 Features

- **Single-Player AI:** 4 scalable difficulty levels (Easy, Medium, Hard, Pro).
- **Pro AI Logic:** Monte Carlo simulations run via Web Worker for non-blocking prediction.
- **Dynamic AI Fleet Deployment:** The AI strategically deploys its fleet based on the chosen difficulty to keep you on your toes.
- **Real-Time Multiplayer:** Create private rooms, share a Join Code, and play against friends using Socket.IO.
- **Responsive UI:** Built with Svelte 5 and TailwindCSS for a smooth, modern experience across devices.

## 🚀 Getting Started

This project is managed as a **Turborepo monorepo** using **pnpm** and **vfox**.

### Prerequisites

- [Node.js](https://nodejs.org/) (v25.9.0 recommended, managed via `.node-version`)
- [vfox](https://vfox.luma.sh/) (for Node.js version management)
- [pnpm](https://pnpm.io/) (v10+ recommended, enabled via Corepack)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/sachinksamad1/battleship.git
   cd battleship
   ```

2. **Enable Corepack and Install Dependencies**

   ```bash
   corepack enable
   pnpm install
   ```

### Running Locally

You can run both the frontend and backend concurrently from the root directory using Turborepo.

1. **Start Development Servers**

   ```bash
   pnpm dev
   ```

   - **Frontend:** `http://localhost:5173`
   - **Backend:** `http://localhost:3000`

2. **Build the Project**

   ```bash
   pnpm build
   ```

3. **Run Tests**
   ```bash
   pnpm test
   ```

## 📂 Project Structure

- `apps/web`: Svelte 5 frontend application.
- `apps/server`: Node.js / Socket.IO backend server.
- `docs`: Detailed project documentation and task tracking.

## 🛠️ Tech Stack

- **Frontend:** Svelte 5, TailwindCSS, Vite, Comlink
- **Backend:** Node.js, Express, Socket.IO
- **Monorepo:** Turborepo, pnpm
- **Testing:** Vitest

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
