# Dependency Management

This document lists the core libraries used in the Battleship project and the criteria for adding new ones.

## 1. Core Production Dependencies

### Frontend
- **SvelteKit**: Full-stack framework for building the UI and routing.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **howler.js**: Framework-agnostic audio library for cross-browser sound support.
- **svelte-dnd-action**: Svelte-native drag-and-drop library.
- **Socket.IO Client**: Real-time communication layer.

### Backend
- **Node.js**: Server runtime.
- **Socket.IO**: WebSocket server implementation.
- **TypeScript**: Ensuring type safety across the entire stack.

### Testing
- **Vitest**: Blazing fast unit and integration testing framework.

## 2. Selection Criteria

Before adding a new dependency, we evaluate:
1. **Svelte Compatibility**: Prefer Svelte-native libraries or framework-agnostic ones.
2. **Bundle Size**: Avoid large, monolithic libraries if a smaller alternative exists.
3. **Maintenance**: Check for active development and security updates.
4. **License**: Must be MIT or Apache-2.0 compatible.

## 3. Explicitly Excluded Libraries

The following libraries are **banned** from the project to maintain consistency:
- `dnd-kit` (React-only)
- `Framer Motion` (React-centric)
- `Zustand` (Use Svelte stores instead)
