# Coding Standards & Development Guidelines

This document outlines the architectural patterns and coding standards used in the Battleship project to ensure consistency and maintainability.

## 1. Frontend Component Architecture

We follow a modular component structure. Components should be small, focused, and reactive.

### Component Tree
```text
GamePage
├── Header
├── StatusBar
├── BoardContainer
│   ├── PlayerBoard
│   ├── EnemyBoard
│   └── Cell
├── ShipPlacementPanel
├── AudioManager
├── NotificationLayer
└── EndGameModal
```

### Cell Rendering Rules
- **Hit && Occupied**: Render explosion effect/destroyed styling.
- **Hit && !Occupied**: Render splash effect/miss marker.
- **Sunk**: Apply "destroyed" visual state to the entire ship.
- **Hover**: Highlight valid/invalid placements during the placement phase.

## 2. Store Architecture Philosophy

Svelte stores are used for global state management. 
- **State Only**: Stores should primarily contain raw data.
- **Minimal Orchestration**: Business logic belongs in the `engine/` or `rules/` modules, not inside the stores.
- **Atomic Stores**: Prefer several small stores (e.g., `playerStore`, `socketStore`) over one giant global object.

## 3. Animation & Audio Guidelines

### Native Svelte Transitions
Avoid heavy external animation libraries. Use Svelte's built-in tools:
- `transition:fade` for overlays and notifications.
- `transition:scale` for hit/miss feedback.
- `animate:flip` for reordering elements.

### Audio Manager
Audio is managed via a centralized `AudioManager` using `howler.js`.
- **Sound Categories**: Hit, Miss, Sink, Victory, Ambient.
- **Triggering**: Events are triggered by state changes or socket responses.

## 4. Performance Optimization

### Frontend
- **Keyed Each Blocks**: Always use unique IDs when iterating over boards or ships (`{#each items as item (item.id)}`).
- **Isolated Cells**: Ensure that an attack on one cell doesn't trigger a full rerender of the entire board.
- **Derived State**: Use `derived` stores for complex calculations to avoid redundant processing in components.

### Backend
- **Room-based Broadcasting**: Only send data to clients within the specific room.
- **Delta Synchronization**: Transmit only the changed portions of the game state to minimize bandwidth.
