# Battleship Web Game — Data Models

## 1. Core Types

### 1.1 Coordinate
```typescript
type Coordinate = {
  x: number; // 0-9 (column, A-J)
  y: number; // 0-9 (row, 1-10)
}
```

String representation: `"A1"` to `"J10"`

### 1.2 Cell
```typescript
type Cell = {
  occupied: boolean;
  shipId?: string;      // undefined if empty
  hit: boolean;         // attacked or not
}
```

### 1.3 Board
```typescript
type Board = Cell[][];  // 10x10 grid
```

Access pattern: `board[y][x]` where y is row (0-9), x is column (0-9)

---

## 2. Ship Models

### 2.1 Ship Definition
```typescript
type ShipDefinition = {
  id: string;           // e.g., "carrier", "battleship"
  name: string;        // display name
  length: number;       // 2, 3, 4, or 5
}
```

### 2.2 Ship State (Runtime)
```typescript
type ShipState = {
  id: string;
  definitionId: string; // references ShipDefinition
  coordinates: Coordinate[];
  hits: number;
  sunk: boolean;
}
```

### 2.3 Fleet Configuration
```typescript
const FLEET_CONFIG: ShipDefinition[] = [
  { id: "carrier",     name: "Carrier",     length: 5 },
  { id: "battleship",  name: "Battleship",  length: 4 },
  { id: "cruiser",     name: "Cruiser",     length: 3 },
  { id: "submarine",   name: "Submarine",   length: 3 },
  { id: "destroyer",   name: "Destroyer",   length: 2 },
];
```

---

## 3. Game State

### 3.1 Game Phase
```typescript
type GamePhase = 
  | "menu"
  | "placement"
  | "matchmaking"
  | "battle"
  | "result"
```

### 3.2 Player State
```typescript
type PlayerState = {
  id: string;
  name: string;
  board: Board;
  ships: ShipState[];
  attacks: Coordinate[];  // coordinates they've attacked
  ready: boolean;
}
```

### 3.3 Match State (Multiplayer)
```typescript
type MatchState = {
  roomId: string;
  phase: GamePhase;
  players: [PlayerState, PlayerState];
  currentTurnPlayerId: string;
  turnNumber: number;
  winnerId?: string;
}
```

---

## 4. Room Models

### 4.1 Room
```typescript
type Room = {
  id: string;
  joinCode: string;        // short code for sharing
  status: RoomStatus;
  players: RoomPlayer[];
  gameState?: MatchState;
  createdAt: number;       // timestamp
}
```

### 4.2 Room Status
```typescript
type RoomStatus = 
  | "waiting"     // waiting for players
  | "ready"       // both players ready
  | "in_progress" // game in battle phase
  | "finished"    // game over
  | "aborted"     // player left
```

### 4.3 Room Player
```typescript
type RoomPlayer = {
  id: string;
  name: string;
  socketId: string;
  ready: boolean;
  connected: boolean;
  shipPlacements?: ShipPlacement[];
}
```

---

## 5. Attack Models

### 5.1 Attack Result
```typescript
type AttackResult = {
  coordinate: Coordinate;
  result: "hit" | "miss";
  shipId?: string;         // if hit, which ship
  shipSunk?: boolean;      // if this hit sank the ship
}
```

### 5.2 Attack Record
```typescript
type AttackRecord = {
  attackerId: string;
  target: Coordinate;
  result: AttackResult;
  turnNumber: number;
  timestamp: number;
}
```

---

## 6. AI Models

### 6.1 AI Difficulty
```typescript
type AIDifficulty = "easy" | "medium" | "hard" | "expert"
```

### 6.2 AI State
```typescript
type AIState = {
  difficulty: AIDifficulty;
  mode: "hunt" | "target";  // target mode after hit
  targetQueue: Coordinate[]; // prioritized targets
  probabilityMap?: number[][]; // for hard/expert
  previousAttacks: Coordinate[];
}
```

---

## 7. Store Models (Svelte Stores)

### 7.1 Game Store
```typescript
type GameStore = {
  phase: GamePhase;
  player: PlayerState;
  enemy?: PlayerState;      // hidden board in multiplayer
  currentTurn: string;      // player ID
  selectedShip?: string;     // ship being placed
  winner?: string;
}
```

### 7.2 UI Store
```typescript
type UIStore = {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  showShipPreview: boolean;
  showCoordinates: boolean;
  toastMessage?: string;
}
```

### 7.3 Socket Store
```typescript
type SocketStore = {
  connected: boolean;
  roomId?: string;
  playerId?: string;
  latency?: number;
}
```

---

## 8. Event Payloads

### 8.1 Client to Server
```typescript
type CreateRoomPayload = {
  playerName: string;
}

type JoinRoomPayload = {
  roomId: string;
  playerName: string;
}

type PlaceShipPayload = {
  roomId: string;
  ships: ShipPlacement[];
}

type AttackPayload = {
  roomId: string;
  coordinate: Coordinate;
}
```

### 8.2 Server to Client
```typescript
type RoomCreatedPayload = {
  roomId: string;
  playerId: string;
  joinCode: string;
}

type AttackResultPayload = {
  attackerId: string;
  coordinate: Coordinate;
  result: "hit" | "miss";
  shipHit?: {
    shipId: string;
    sunk: boolean;
  };
}

type GameOverPayload = {
  winnerId: string;
  winnerName: string;
  finalState: {
    yourBoard: Board;
    enemyBoard: Board;
  };
}
```

---

## 9. Settings Model
```typescript
type GameSettings = {
  soundEnabled: boolean;
  volume: number;           // 0-1
  animationSpeed: "slow" | "normal" | "fast";
  showGridNumbers: boolean;
  autoRotateShips: boolean;
  difficulty: AIDifficulty; // single-player default
}
```
