# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Phase 4 roadmap planned (UI Polish, Animations, Audio).

## [1.0.0] - 2026-05-04

### Added
- **Core Game Engine:** 10x10 board, ship placement logic, and attack resolution.
- **Single-Player AI:** 4 difficulties (Easy, Medium, Hard, Pro).
- **Pro AI Logic:** Monte Carlo simulations run via Web Worker for non-blocking prediction.
- **Dynamic Fleet Deployment:** AI intelligently places ships based on difficulty.
- **Multiplayer Backend:** Node.js/Socket.IO server for real-time play.
- **Multiplayer Frontend:** Room creation, matchmaking via Join Codes, and synced game state.
- **Responsive UI:** Svelte 5 frontend with TailwindCSS.