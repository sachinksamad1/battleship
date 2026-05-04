# Deployment & CI/CD

This document details the hosting strategy, environment configuration, and automated pipeline for the Battleship project.

## 1. Deployment Architecture

The application is split into two distinct parts for deployment:

### Frontend (Vercel)
- **Framework**: SvelteKit
- **Deployment**: [Vercel](https://vercel.com/)
- **Responsibilities**:
  - Hosting the static assets and SvelteKit application.
  - Global CDN delivery for fast loading.
  - Handling initial HTTPS requests.

### Backend (Railway)
- **Runtime**: Node.js + Socket.IO
- **Deployment**: [Railway](https://railway.app/)
- **Responsibilities**:
  - Managing active WebSocket connections.
  - Running the authoritative game engine for multiplayer rooms.
  - Handling real-time match state.

## 2. Environment Variables

The following variables must be configured in the respective hosting platforms:

| Variable | Description | Location |
| :--- | :--- | :--- |
| `PUBLIC_SOCKET_URL` | The URL of the Railway backend server. | Vercel |
| `PORT` | The port the backend server listens on (provided by Railway). | Railway |
| `NODE_ENV` | Set to `production` or `development`. | Both |

## 3. CI/CD Pipeline

We use GitHub Actions for our automated pipeline.

### Pipeline Workflow
1. **Lint & Type-Check**: Run `npm run lint` and `tsc` to ensure code quality.
2. **Run Tests**: Execute all unit and integration tests via `vitest`.
3. **Build**: 
   - Build the SvelteKit frontend.
   - Build the TypeScript backend.
4. **Deploy**:
   - Trigger a Vercel deployment for the frontend.
   - Trigger a Railway deployment for the backend.

### Branching Strategy
- **main**: Production-ready code. Auto-deploys to production.
- **develop**: Integration branch for new features.
- **feature/* / fix/* **: Topic branches for individual tasks.
