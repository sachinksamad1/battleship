# AI-Driven Development Task Lists

This directory contains a structured, phased roadmap for an AI agent to build the Battleship Web Game from scratch. These tasks are derived from the project's PRD, Architecture, and API specifications.

## Core Execution Principles

For any AI agent executing these tasks, the following principles are mandatory:

1. **Test-Driven Development (TDD)**: Every logic module or engine must have a corresponding Vitest suite. Tests should ideally be written alongside or before the implementation to verify core requirements.
2. **Pure Logic Isolation**: The "Core Game Engine" must be built using pure functions. It should have no dependencies on the UI (Svelte), state management (Stores), or networking (Socket.IO).
3. **Strict Typing**: Use the TypeScript schemas defined in `docs/api/schemas.md`. Do not use `any`.
4. **Validation is Finality**: A task is only "complete" when its behavioral correctness is verified by tests and its structural integrity is confirmed within the project context.

## Phased Roadmap

The development is broken into four sequential phases:

- **[Phase 1: Foundation & Core Game Engine](./01-foundation-engine.md)**: Project setup and the pure-logic engine (Board, Ship, Attack validation).
- **[Phase 2: State Management & Single Player](./02-singleplayer-ai.md)**: Svelte stores, local game loop, and AI opponent difficulties.
- **[Phase 3: Multiplayer Backend](./03-multiplayer-server.md)**: Node.js/Socket.IO server, room management, and server-authoritative validation.
- **[Phase 4: Frontend Integration & UI Polish](./04-frontend-integration.md)**: SvelteKit components, Drag & Drop placement, animations, audio, and final integration.

---

*Note: Complete each phase fully before moving to the next. The system relies on a solid logic foundation for stable multiplayer play.*
