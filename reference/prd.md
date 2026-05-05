# Battleship Web Game — Product Requirements Document

## 1. Product Overview

### 1.1 Purpose
A web-based implementation of the classic pen-and-paper Battleship game with single-player (vs AI) and real-time multiplayer modes.

### 1.2 Target Audience
- Casual gamers familiar with Battleship
- Players seeking quick strategic matches
- Mobile and desktop web users

### 1.3 Platform
- Responsive web application (desktop + mobile)
- Modern browser support (Chrome, Firefox, Safari, Edge)

---

## 2. Game Rules Specification

### 2.1 Grid
- 10×10 grid per player
- Coordinates: A-J (columns), 1-10 (rows)
- Total 100 cells per grid

### 2.2 Fleet Composition
| Ship | Length | Count |
|-----|--------|-------|
| Carrier | 5 | 1 |
| Battleship | 4 | 1 |
| Cruiser | 3 | 1 |
| Submarine | 3 | 1 |
| Destroyer | 2 | 1 |

### 2.3 Placement Rules
- Ships placed horizontally or vertically (no diagonal)
- No overlapping ships
- Ships may touch but not occupy same cells
- Placement phase before battle begins

### 2.4 Combat Rules
- Players alternate turns
- One attack per turn (single coordinate)
- Hit: part of ship occupied → mark X
- Miss: empty cell → mark O
- Sunk: all cells of a ship hit → announce sunk
- Victory: all enemy ships sunk

---

## 3. Functional Requirements

### 3.1 Core Gameplay
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | 10×10 interactive game board | P0 |
| FR-02 | Ship placement with drag-and-drop | P0 |
| FR-03 | Turn-based attack system | P0 |
| FR-04 | Hit/miss visualization | P0 |
| FR-05 | Ship sinking detection | P0 |
| FR-06 | Win/loss detection | P0 |
| FR-07 | Game over screen with rematch option | P0 |

### 3.2 Single-Player Mode
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-08 | AI opponent with 4 difficulty levels | P0 |
| FR-09 | Easy: random targeting | P0 |
| FR-10 | Medium: hunt mode after hit | P1 |
| FR-11 | Hard: probability density map | P1 |
| FR-12 | Expert: predictive algorithm | P2 |

### 3.3 Multiplayer Mode
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-13 | Create private room | P0 |
| FR-14 | Join room via code | P0 |
| FR-15 | Real-time attack synchronization | P0 |
| FR-16 | Turn indicator | P0 |
| FR-17 | Opponent disconnect handling | P1 |
| FR-18 | Reconnection support | P1 |

### 3.4 UI/UX
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-19 | Responsive design (mobile + desktop) | P0 |
| FR-20 | Attack animations (hit/miss/sink) | P1 |
| FR-21 | Sound effects | P1 |
| FR-22 | Ship placement preview/ghosting | P1 |
| FR-23 | Game phase transitions | P1 |
| FR-24 | Settings panel (sound toggle, etc.) | P2 |

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Board render: <16ms (60fps)
- Attack response: <100ms (local), <300ms (multiplayer)
- Socket latency tolerance: up to 2s with reconnection

### 4.2 Compatibility
- Modern browsers (last 2 versions)
- Mobile: iOS Safari, Android Chrome
- Screen sizes: 320px to 1920px width

### 4.3 Security
- Server-authoritative game state
- Input validation on all attacks/placements
- No client-side cheat prevention bypass

---

## 5. MVP Scope

### 5.1 In Scope (Phase 1)
- Single-player vs AI (all difficulties)
- Multiplayer rooms (create/join)
- Ship placement UI
- Attack mechanics
- Hit/miss/sink detection
- Basic animations and sound
- Responsive layout

### 5.2 Out of Scope (Phase 1)
- Chat system
- Ranked matchmaking
- User accounts/database
- Ship cosmetics
- Replay system
- Tournaments

---

## 6. Success Metrics

- Single-player game completion without bugs
- Multiplayer room creation and full game
- AI difficulty scales appropriately
- Mobile responsive layout functional
- <2s reconnection time after disconnect
