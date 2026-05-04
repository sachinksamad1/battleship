# Local Development Setup

This guide provides detailed instructions for setting up your local environment for contributing to the Battleship project.

## 1. Environment Requirements

- **Runtime**: Node.js 18.x or 20.x
- **Package Manager**: npm (v9+) or pnpm
- **Editor**: VS Code (recommended) with Svelte and Tailwind CSS extensions.

## 2. Step-by-Step Setup

### Step 1: Clone and Install
```bash
git clone https://github.com/your-username/battleship.git
cd battleship
npm install
```

### Step 2: Configure Environment
Copy the example environment file:
```bash
cp .env.example .env
```
Ensure `PUBLIC_SOCKET_URL` is set to `http://localhost:3000` for local testing.

### Step 3: Run Development Servers
We recommend running the server and client in separate terminal windows:

**Terminal 1 (Backend):**
```bash
npm run dev:server
```

**Terminal 2 (Frontend):**
```bash
npm run dev:client
```

## 3. Working with Scripts

| Command | Description |
| :--- | :--- |
| `npm run build` | Builds both the client and server for production. |
| `npm run test` | Runs the Vitest suite for the entire project. |
| `npm run lint` | Checks for linting errors across the codebase. |
| `npm run format` | Automatically formats code using Prettier. |

## 4. Debugging

### Server Logs
The backend uses a standard logging utility. You can increase verbosity by setting `DEBUG=battleship:*` in your `.env`.

### Browser DevTools
Use the **Svelte DevTools** extension to inspect component state and the **Network** tab (WS filter) to monitor Socket.IO traffic.
