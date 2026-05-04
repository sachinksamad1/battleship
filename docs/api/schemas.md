# Data Schemas & Types

This document defines the core TypeScript types and data structures used by both the Frontend (SvelteKit) and Backend (Node.js).

## 1. Core Grid Models

### Coordinate
Represents a position on the 10x10 board.
```typescript
type Coordinate = {
  x: number; // 0-9 (Column A-J)
  y: number; // 0-9 (Row 1-10)
}
```

### Cell
The smallest unit of the board.
```typescript
type Cell = {
  occupied: boolean;   // True if a ship part is present
  shipId?: string;     // ID of the ship occupying this cell
  hit: boolean;        // True if the cell has been attacked
}
```

### Board
A 10x10 grid of Cells.
```typescript
type Board = Cell[][];
```

---

## 2. Ship Models

### Ship Definition
Static configuration for ship types.
```typescript
type ShipDefinition = {
  id: string;          // e.g., "carrier", "battleship"
  name: string;        // Display name
  length: number;      // Number of cells occupied
}
```

### Ship State
Runtime tracking of a ship's status.
```typescript
type ShipState = {
  id: string;
  definitionId: string; // References ShipDefinition
  coordinates: Coordinate[];
  hits: number;
  sunk: boolean;
}
```

---

## 3. Game & Room Models

### Game Phase
```typescript
type GamePhase = 
  | "menu"
  | "placement"
  | "matchmaking"
  | "battle"
  | "result"
```

### Player State
```typescript
type PlayerState = {
  id: string;
  name: string;
  board: Board;
  ships: ShipState[];
  attacks: Coordinate[];
  ready: boolean;
}
```

### Room Player
Metadata for players within a Socket.IO room.
```typescript
type RoomPlayer = {
  id: string;
  name: string;
  socketId: string;
  ready: boolean;
  connected: boolean;
}
```

---

## 4. AI Models

### AI State
Tracking logic for the computer opponent.
```typescript
type AIState = {
  difficulty: "easy" | "medium" | "hard" | "expert";
  mode: "hunt" | "target";
  targetQueue: Coordinate[];
  probabilityMap?: number[][];
  previousAttacks: Coordinate[];
}
```

---

## 5. Event Payloads

### Attack Result
```typescript
type AttackResult = {
  coordinate: Coordinate;
  result: "hit" | "miss";
  shipId?: string;
  shipSunk?: boolean;
}
```
