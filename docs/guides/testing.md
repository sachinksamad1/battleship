# Testing & Security

This document covers our strategy for ensuring the reliability, correctness, and security of the Battleship game.

## 1. Testing Architecture

We utilize **Vitest** for all testing layers. Tests are designed to be fast, reliable, and run in both CI and local environments.

### Testing Layers
- **Unit Tests**: Focus on pure functions within the Game Engine (e.g., placement validation, coordinate mapping).
- **Integration Tests**: Verify interactions between the Engine, Stores, and AI.
- **Multiplayer Sync Tests**: Ensure Socket.IO events correctly update the state across multiple simulated clients.
- **UI Tests**: Validate component rendering states and user interaction flows.

### Example Test Cases (Vitest)
- `cannot overlap ships`: Ensure the placement engine rejects overlapping coordinates.
- `cannot attack same coordinate twice`: Validate that the attack engine blocks redundant moves.
- `winner detected correctly`: Verify that sinking the final ship triggers the win condition state.
- `turn order enforced`: Ensure a player cannot move during the opponent's turn.

## 2. Security Architecture

Security is critical in the multiplayer environment. We follow the principle: **"Never Trust the Client."**

### Multiplayer Security Rules
The server is the ultimate authority. It validates every incoming intent:
- **Placement Validation**: The server checks that ship placements are legal before starting a match.
- **Turn Validation**: The server rejects attacks sent by a player whose turn it is not.
- **Move Validation**: The server ensures attacks are within bounds and have not been made previously.

### Anti-Cheat Measures
| Risk | Mitigation |
| :--- | :--- |
| **Fake Hits** | The server calculates hits/misses; clients only report coordinates. |
| **Extra Turns** | Authoritative turn management on the server prevents turn-skipping. |
| **Hidden Board Leak** | The server only sends the opponent's board state *after* an attack (hit/miss), never the full ship layout. |
| **Replay Attacks** | Event validation and unique session tokens prevent replaying historical socket messages. |
