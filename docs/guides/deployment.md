# Deployment & CI/CD

This document details the hosting strategy, environment configuration, and automated pipeline for the Battleship project.

## 1. Deployment Architecture

The application is split into two distinct parts for deployment:

### Frontend (Vercel)
- **Framework**: SvelteKit
- **Deployment**: [Vercel](https://vercel.com/)
- **Responsibilities**: Hosting the UI, static assets, and client-side logic.

### Backend (Railway)
- **Runtime**: Node.js + Socket.IO
- **Deployment**: [Railway](https://railway.app/)
- **Responsibilities**: Managing WebSocket connections and authoritative game engine logic.

## 2. Prerequisites

Before starting the deployment, ensure you have:
- A [Vercel](https://vercel.com/) account.
- A [Railway](https://railway.app/) account.
- The project repository pushed to a GitHub account.
- Environment variables ready for configuration.

## 3. Frontend Deployment (Vercel)

Follow these steps to deploy the web frontend:

1.  **Import Project**: Log in to the Vercel Dashboard and click "Add New" > "Project".
2.  **Connect GitHub**: Select the `battleship` repository from your GitHub list.
3.  **Configure Project**:
    -   **Framework Preset**: Select `SvelteKit`.
    -   **Root Directory**: Set this to `apps/web`.
    -   **Build & Output Settings**: 
        -   Vercel should automatically detect the monorepo structure and use `pnpm` (if the lockfile is at the root).
        -   Ensure the build command is `npm run build` (which runs `vite build` within `apps/web`).
4.  **Environment Variables**:
    -   Add `PUBLIC_SOCKET_URL`: This should be the public URL provided by Railway (e.g., `https://battleship-backend.up.railway.app`).
5.  **Deploy**: Click "Deploy". Vercel will build and host your frontend.

## 4. Backend Deployment (Railway)

Follow these steps to deploy the server backend:

1.  **New Project**: Log in to Railway and click "New Project" > "Deploy from GitHub repo".
2.  **Select Repository**: Choose the `battleship` repository.
3.  **Configure Service**:
    -   Railway will detect the root `package.json`. You need to point it to the backend service.
    -   Go to the service **Settings** > **General** > **Root Directory** and set it to `apps/server`.
    -   Railway will automatically use the `pnpm-lock.yaml` at the root for dependency resolution.
4.  **Build & Start Commands**:
    -   Railway usually detects the `start` script. Ensure it's set to `npm run start` (which should run the compiled JS in `dist/`).
    -   Ensure the Build command is `npm run build`.
-   **Environment Variables**:
    -   Railway provides a `PORT` variable automatically; ensure your `apps/server/src/index.ts` uses `process.env.PORT`.
    -   Set `NODE_ENV` to `production`.
-   **Public Domain**: Go to **Settings** > **Networking** and click "Generate Domain" to get the public URL for your backend. This URL must be provided to the Vercel frontend.

## 5. Troubleshooting Railway Deployment

If you encounter errors during the Railway deployment:

### "Missing script: migrate"
Railway may automatically attempt to run a database migration if it detects a database service in your project. Since this project uses an in-memory game state:
1.  A dummy `"migrate": "echo 'No migrations to run'"` script has been added to `apps/server/package.json`.
2.  Alternatively, ensure there are no "Pre-deploy" or "Custom Start" commands in the Railway Dashboard calling `npm run migrate`.

### "npm warn config production Use --omit=dev instead"
This is a deprecation warning from `npm` when `NODE_ENV=production` is set. It does not stop the build, but you can ignore it or update the build command in Railway to `npm install --omit=dev && npm run build` if you want to be explicit.

## 6. Environment Variables Overview

| Variable | Description | Location |
| :--- | :--- | :--- |
| `PUBLIC_SOCKET_URL` | The public URL of the Railway backend. | Vercel |
| `PORT` | The port the backend server listens on. | Railway (Auto) |
| `NODE_ENV` | Environment mode (`production` / `development`). | Both |

## 6. CI/CD Pipeline

We use GitHub Actions for automated quality checks and deployment triggers.

### Pipeline Workflow
1.  **Lint & Type-Check**: `npm run lint` and `tsc`.
2.  **Test**: `pnpm test`.
3.  **Build**: Multi-package build via `turbo`.
4.  **Deploy**: Automatic triggers on `main` branch push.

### Branching Strategy
-   **main**: Production-ready code. Auto-deploys to production.
-   **develop**: Integration branch for new features.
-   **feature/* / fix/* **: Topic branches for individual tasks.
