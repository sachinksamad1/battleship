# Configuration & Settings

This document covers both environment-level configuration and in-game user settings.

## 1. Environment Variables

The application requires the following environment variables for deployment and local development.

### Shared / Global
- `NODE_ENV`: Either `development` or `production`.

### Backend (Railway)
- `PORT`: The port the Socket.IO server will listen on.
- `CORS_ORIGIN`: The URL of the frontend (Vercel) to allow cross-origin requests.

### Frontend (Vercel)
- `PUBLIC_SOCKET_URL`: The full URL of the backend server (e.g., `https://battleship-api.railway.app`).

---

## 2. In-Game Settings

Users can customize their experience through the **Settings Panel**, which persists data to `localStorage`.

### Audio
- **Master Volume**: 0.0 to 1.0.
- **Mute All**: Toggle to disable all sound effects.

### Visuals
- **Animation Speed**: `Slow`, `Normal`, or `Fast`.
- **Show Grid Numbers**: Toggle coordinate labels (A-J, 1-10) on/off.
- **High Performance Mode**: Disables complex particles and ripple effects for older devices.

### Gameplay
- **Auto-Rotate Ships**: Automatically flips ships if they don't fit in the current orientation during a drag.
- **Default Difficulty**: Sets the initial AI level for single-player matches.
