# System Design

This document details the internal design of the Battleship game engine, state management, and the networking layer.

## 1. Core Game Engine Architecture

The game engine is designed as a collection of modular sub-engines, each responsible for a specific aspect of the game logic. It is built using pure functions to ensure testability and consistency between the client and server.

| Module | Responsibility |
| :--- | :--- |
| **Board Engine** | Manages the 10x10 grid state and coordinate transformations. |
| **Ship Placement Engine** | Validates ship positions (horizontal/vertical, no overlap, within bounds). |
| **Attack Engine** | Resolves hit/miss logic and updates ship health. |
| **Turn Engine** | Manages player turn transitions and validation. |
| **Win Condition Engine** | Detects when all ships of a player are sunk. |
| **Serialization Engine** | Handles state synchronization for multiplayer matches. |

### Engine API Examples
- `placeShip(board, ship, position)`: Validates and places a ship.
- `attack(board, coordinate)`: Returns hit/miss result and updated board.
- `checkWinner(gameState)`: Returns the winner if conditions are met.

## 2. Game State Design

The game state is a structured object representing the entire match at any given point.

### State Model
```typescript
type Cell = {
  occupied: boolean;
  shipId?: string;
  hit: boolean;
};

type Board = Cell[][];

type Ship = {
  id: string;
  length: number;
  coordinates: Coordinate[];
  hits: number;
  sunk: boolean;
};

type GameState = {
  phase: GamePhase;
  players: Record<string, PlayerState>;
  turn: string; // Player ID
  metadata: MatchMetadata;
};
```

### Phase State Machine
1. **MENU**: Initial landing state.
2. **PLACEMENT**: Players arranging their ships.
3. **MATCHMAKING**: Waiting for an opponent (Multiplayer).
4. **BATTLE**: The active game loop (turns and attacks).
5. **RESULT**: Victory/Loss screen.
6. **REMATCH/EXIT**: Post-game decision.

## 3. AI Architecture (Single-Player)

The AI logic is decoupled from the engine and scales with difficulty.

| Difficulty | Strategy |
| :--- | :--- |
| **Easy** | Randomly selects valid coordinates. |
| **Medium** | "Hunt mode": Targets adjacent cells once a hit is registered. |
| **Hard** | Probability density calculation based on remaining ships. |
| **Expert** | Predictive patterns and optimized search algorithms. |

## 4. Multiplayer & Networking

### Room Lifecycle
1. **Create/Join**: Server allocates a unique Room ID.
2. **Ready State**: Both players must confirm ship placement.
3. **Battle Loop**: Server validates turn order and attacks.
4. **Cleanup**: Room is destroyed after the result or a timeout.

### Socket Events
- **Client → Server**: `create_room`, `join_room`, `place_ship`, `attack`, `ready`.
- **Server → Client**: `room_created`, `player_joined`, `attack_result`, `turn_changed`, `game_over`.

### Synchronization & Reconnection
- **Delta Updates**: The server sends only the changes (e.g., the result of an attack) rather than the full state to save bandwidth.
- **Authoritative Validation**: All moves are validated server-side.
- **Reconnection**: If a client disconnects, the server retains the room state for a brief period, allowing the client to resync and resume.
