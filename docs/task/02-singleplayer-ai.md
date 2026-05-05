# Phase 2: State Management & Single Player

This phase moves the pure logic into the Svelte application environment, setting up global state and implementing the AI opponent for a functional local single-player experience.

## 2.1 Svelte Store Setup
- [x] Create `src/lib/stores/gameStore.ts`.
- [x] Implement `gameStore`: Tracks `phase`, `turn`, `winner`.
- [x] Create `src/lib/stores/playerStore.ts`: Tracks `board`, `ships`, `attacks`.
- [x] Create `src/lib/stores/uiStore.ts`: Tracks settings like `soundEnabled`, `highPerformanceMode`.

## 2.2 Phase State Machine
- [x] Implement logic to transition between phases: `MENU` -> `PLACEMENT` -> `BATTLE` -> `RESULT`.
- [x] **Tests**:
    - [x] Should not allow attacking during `PLACEMENT` phase.
    - [x] Should transition to `RESULT` phase immediately when `isGameOver` is true.

## 2.3 AI Logic Implementation
- [x] Create `src/lib/game/ai/aiEngine.ts`.
- [x] **Easy AI**: Implement random coordinate selection.
- [x] **Medium AI**: Implement "Hunt & Target" mode (search neighbors after a hit).
- [x] **Hard AI**: Implement Probability Density Map (identify gaps where ships fit).
- [x] **Tests**:
    - [x] AI should never attack the same coordinate twice.
    - [x] Medium AI should prioritize neighbors of a known hit.
    - [x] AI should only target coordinates within the 10x10 grid.

## 2.4 Single-Player Loop Integration
- [x] Implement `handlePlayerAttack(coord)`: Resolves player move -> Updates state -> Triggers AI turn.
- [x] Implement `handleAiTurn()`: Triggers AI move -> Adds delay for realism -> Updates state -> Returns turn to player.
- [x] Implement AI auto-placement for the enemy board. (Handled via `setupDemoMatch` in MVP)

## 2.5 local Game Loop Validation
- [x] Verify a full game can be played from Menu to Result against an Easy AI.
- [x] Ensure AI "thinking" delay doesn't block the UI thread (use `setTimeout` or `async`).

---

**Phase 2 Exit Criteria**: A fully playable local single-player game with functional AI (at least Easy/Medium levels) and responsive state updates. (Status: **COMPLETED**)
