# Phase 1: Foundation & Core Game Engine

This phase focuses on setting up the technical foundation and building the "brain" of the game—the core logic engine—using pure TypeScript and Test-Driven Development.

## 1.1 Project Initialization
- [x] Initialize a new SvelteKit project (TypeScript, Tailwind CSS).
- [x] Install dev dependencies: `vitest`, `prettier`, `eslint`, `typescript`.
- [x] Configure `vitest` for unit testing.
- [x] Verify environment setup by running a "Hello World" test.

## 1.2 Core Schema Definition
- [x] Create `src/lib/game/types.ts`.
- [x] Define `Coordinate` type `{ x: number, y: number }`.
- [x] Define `Cell` type `{ occupied: boolean, shipId?: string, hit: boolean }`.
- [x] Define `Board` type `Cell[][]`.
- [x] Define `ShipState` and `ShipDefinition` types.
- [x] Verify types align with `docs/api/schemas.md`.

## 1.3 Board Engine (Pure Logic)
- [x] Implement `createBoard(size: number): Board`.
- [x] Implement `getCoordinate(board: Board, coord: Coordinate): Cell`.
- [x] **Tests**:
    - [x] Should create a 10x10 grid by default.
    - [x] Should initialize all cells as empty and not hit.
    - [x] Should throw error or return null for out-of-bounds coordinates.

## 1.4 Ship Placement Engine
- [x] Implement `validatePlacement(board: Board, ship: ShipDefinition, coord: Coordinate, orientation: 'H' | 'V'): boolean`.
- [x] Implement `placeShip(board: Board, ship: ShipDefinition, coord: Coordinate, orientation: 'H' | 'V'): Board`.
- [x] **Tests**:
    - [x] Should allow valid horizontal/vertical placement.
    - [x] Should reject placement that goes out of bounds.
    - [x] Should reject placement that overlaps an existing ship.
    - [x] Should allow ships to touch edges but not overlap.

## 1.5 Attack Engine
- [x] Implement `resolveAttack(board: Board, coord: Coordinate): { board: Board, result: 'hit' | 'miss', shipSunk?: string }`.
- [x] **Tests**:
    - [x] Should mark a cell as "hit" after an attack.
    - [x] Should return 'hit' if the cell was occupied.
    - [x] Should return 'miss' if the cell was empty.
    - [x] Should correctly identify when a ship's last remaining health is hit (Sunk).
    - [x] Should prevent attacking the same coordinate twice.

## 1.6 Win Condition Engine
- [x] Implement `isGameOver(ships: ShipState[]): boolean`.
- [x] **Tests**:
    - [x] Should return false if at least one ship is not sunk.
    - [x] Should return true when all ships in the fleet have the `sunk: true` status.

---

**Phase 1 Exit Criteria**: 100% pass rate on all unit tests for the Board, Placement, Attack, and Win engines. (Status: **COMPLETED**)
