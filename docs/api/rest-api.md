# Real-time API Specification (Socket.IO)

The Battleship Web Game uses **Socket.IO** for real-time, bidirectional communication between the client and the server.

## 1. Connection

- **URL**: `wss://<server-url>/socket.io/`
- **Protocol**: WebSocket

### Connection Events
| Event | Direction | Description |
| :--- | :--- | :--- |
| `connect` | S → C | Successfully established connection. |
| `disconnect` | S → C | Connection lost. |
| `error` | S → C | General error message. |

---

## 2. Room Management

### `create_room` (C → S)
Initiates a new game room.
- **Payload**: `{ playerName: string }`

### `room_created` (S → C)
Broadcasted when a room is successfully created.
- **Payload**: `{ roomId: string, playerId: string, joinCode: string }`

### `join_room` (C → S)
Joins an existing room using a Room ID.
- **Payload**: `{ roomId: string, playerName: string }`

### `player_joined` (S → C)
Notifies existing players that a new player has arrived.
- **Payload**: `{ playerId: string, playerName: string, players: PlayerInfo[] }`

---

## 3. Game Setup

### `place_ship` (C → S)
Sends the initial ship placements to the server.
- **Payload**: `{ roomId: string, ships: ShipPlacement[] }`

### `ready` (C → S)
Signals that the player is ready to start the match.
- **Payload**: `{ roomId: string }`

---

## 4. Gameplay

### `attack` (C → S)
Triggers an attack on a specific coordinate.
- **Payload**: `{ roomId: string, coordinate: { x: number, y: number } }`

### `attack_result` (S → C)
Broadcasts the outcome of an attack.
- **Payload**: 
  ```typescript
  {
    attackerId: string,
    coordinate: { x, y },
    result: "hit" | "miss",
    shipHit?: { shipId: string, sunk: boolean }
  }
  ```

### `turn_changed` (S → C)
Notifies clients whose turn it is.
- **Payload**: `{ currentPlayerId: string }`

---

## 5. Game End & Restoration

### `game_over` (S → C)
Triggered when a win condition is met.
- **Payload**: `{ winnerId: string, finalState: { yourBoard, enemyBoard } }`

### `game_restored` (S → C)
Used during reconnection to resync the client with the current server state.
- **Payload**: Full `GameState` object.
