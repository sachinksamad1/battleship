# **Battleship Web Game — Detailed Architecture Design**

## **Technology Stack**

### **Frontend**

* SvelteKit  
* Tailwind CSS  
* TypeScript

### **State Management**

* Svelte stores

### **Animation**

* Native Svelte transitions  
* NOTE: remove Framer Motion from the stack. It is React-specific and not suitable for Svelte.

### **Drag & Drop**

* Replace `dnd-kit` (React-only)  
* Use:  
  * svelte-dnd-action

### **Audio**

* howler.js

### **Backend**

* Node.js  
* Socket.IO  
* TypeScript

### **Testing**

* Vitest

### **Deployment**

* Frontend → Vercel  
* Backend → Railway

---

# **1\. System Architecture Overview**

               ┌────────────────────┐  
                │     Frontend       │  
                │     SvelteKit      │  
                └─────────┬──────────┘  
                          │  
                HTTPS / WebSocket  
                          │  
            ┌─────────────▼─────────────┐  
            │      Node.js Server       │  
            │        Socket.IO          │  
            └─────────────┬─────────────┘  
                          │  
             ┌────────────┴────────────┐  
             │                         │  
      Single Player             Multiplayer Rooms  
        Game Engine               Match Engine

---

# **2\. Architectural Principles**

---

## **A. Server Authoritative Multiplayer**

Server owns:

* game state,  
* turn validation,  
* attack validation,  
* win conditions.

Clients:

* render UI,  
* send intents only.

---

## **B. Shared Game Engine**

Same engine used by:

* single-player,  
* multiplayer,  
* AI,  
* tests.

Critical for consistency.

---

## **C. UI Decoupled from Logic**

Frontend components:

* only render state,  
* never implement rules.

---

# **3\. Frontend Architecture**

---

# **Frontend Folder Structure**

src/  
├── app.html  
├── routes/  
│   ├── \+layout.svelte  
│   ├── \+page.svelte  
│   ├── singleplayer/  
│   ├── multiplayer/  
│   └── settings/  
│  
├── lib/  
│   ├── components/  
│   │   ├── board/  
│   │   ├── ship/  
│   │   ├── ui/  
│   │   ├── overlays/  
│   │   └── effects/  
│   │  
│   ├── game/  
│   │   ├── engine/  
│   │   ├── ai/  
│   │   ├── rules/  
│   │   ├── models/  
│   │   └── utils/  
│   │  
│   ├── stores/  
│   │  
│   ├── socket/  
│   │  
│   ├── audio/  
│   │  
│   ├── animations/  
│   │  
│   └── config/  
│  
├── static/  
└── tests/

---

# **4\. Core Game Engine Architecture**

---

# **Engine Design**

Game Engine  
├── Board Engine  
├── Ship Placement Engine  
├── Attack Engine  
├── Turn Engine  
├── Win Condition Engine  
└── Serialization Engine

---

# **Engine Responsibilities**

| Module | Responsibility |
| ----- | ----- |
| Board Engine | grid state |
| Placement Engine | validate ship placement |
| Attack Engine | hit/miss resolution |
| Turn Engine | player turns |
| Win Engine | detect victory |
| Serialization | sync multiplayer state |

---

# **Example Engine API**

placeShip(board, ship, position)  
attack(board, coordinate)  
getValidPlacements()  
checkWinner()  
serializeGameState()

Pure functions only.

No DOM access.

---

# **5\. Game State Design**

---

# **State Model**

Global Game State  
├── Phase  
├── Player State  
├── Enemy State  
├── Boards  
├── Ships  
├── Turn Info  
├── Match Metadata  
└── UI State

---

# **Game Phase State Machine**

MENU  
  ↓  
PLACEMENT  
  ↓  
MATCHMAKING (multiplayer only)  
  ↓  
BATTLE  
  ↓  
RESULT  
  ↓  
REMATCH / EXIT

---

# **TypeScript Types**

type GamePhase \=  
  | "menu"  
  | "placement"  
  | "battle"  
  | "result";

---

# **6\. Board Architecture**

---

# **Board Model**

type Cell \= {  
  occupied: boolean;  
  shipId?: string;  
  hit: boolean;  
};

type Board \= Cell\[\]\[\];

---

# **Ship Model**

type Ship \= {  
  id: string;  
  length: number;  
  coordinates: Coordinate\[\];  
  hits: number;  
  sunk: boolean;  
};

---

# **Coordinate System**

A1 → \[0,0\]  
B5 → \[1,4\]  
J10 → \[9,9\]

---

# **7\. Frontend Component Architecture**

---

# **Component Tree**

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

---

# **Cell Component**

## **Responsibilities**

* render hit/miss,  
* hover effects,  
* attack interaction,  
* placement highlighting.

---

# **Cell Rendering Rules**

if hit && occupied → explosion  
if hit && \!occupied → splash  
if sunk → destroyed styling

---

# **8\. Single-Player Architecture**

---

# **Flow**

Player Turn  
   ↓  
Attack Engine  
   ↓  
Update State  
   ↓  
AI Turn  
   ↓  
AI Engine  
   ↓  
Update State

---

# **AI Architecture**

AI/  
├── randomAI.ts  
├── huntAI.ts  
├── probabilityAI.ts  
└── adaptiveAI.ts

---

# **AI Difficulty Scaling**

| Difficulty | Logic |
| ----- | ----- |
| Easy | random |
| Medium | hunt mode |
| Hard | probability density |
| Expert | predictive |

---

# **9\. Multiplayer Architecture**

---

# **Multiplayer Design**

Client  
   ↓  
Socket.IO  
   ↓  
Match Server  
   ↓  
Room Manager  
   ↓  
Shared Game Engine

---

# **Room Lifecycle**

Create Room  
Join Room  
Ready State  
Ship Placement  
Battle Start  
Turn Loop  
Result  
Cleanup

---

# **Room Model**

type Room \= {  
  id: string;  
  players: Player\[\];  
  gameState: GameState;  
  status: RoomStatus;  
};

---

# **Socket Events**

---

# **Client → Server**

create\_room  
join\_room  
place\_ship  
attack  
ready  
leave\_room

---

# **Server → Client**

room\_created  
player\_joined  
game\_started  
attack\_result  
turn\_changed  
ship\_sunk  
game\_over

---

# **Multiplayer Synchronization**

Server sends:

* delta updates,  
* not full board every turn.

Improves scalability.

---

# **10\. Networking Architecture**

---

# **Socket Layer**

socket/  
├── client.ts  
├── events.ts  
├── handlers.ts  
└── reconnection.ts

---

# **Reconnection Handling**

Player reconnect:

* restore room,  
* resync board,  
* continue match.

Important for Railway deployment.

---

# **11\. Animation Architecture**

---

# **Recommended Effects**

| Effect | Technique |
| ----- | ----- |
| Hit | scale \+ fade |
| Miss | ripple |
| Sink | shake \+ fade |
| Placement | ghost preview |
| Turn switch | slide transition |

---

# **Use Native Svelte**

transition:fade  
transition:scale  
animate:flip

Avoid excessive JS animation systems.

---

# **12\. Audio Architecture**

---

# **Audio Manager**

audio/  
├── hit.ts  
├── miss.ts  
├── sink.ts  
├── ambient.ts  
└── manager.ts

---

# **Sound Categories**

| Sound | Trigger |
| ----- | ----- |
| Hit | successful attack |
| Miss | failed attack |
| Sink | ship destroyed |
| Victory | match won |

---

# **13\. Store Architecture**

---

# **Recommended Stores**

stores/  
├── gameStore.ts  
├── playerStore.ts  
├── enemyStore.ts  
├── socketStore.ts  
├── uiStore.ts  
└── settingsStore.ts

---

# **Store Philosophy**

Stores contain:

* state only,  
* minimal orchestration.

Complex logic belongs in engine.

---

# **14\. Testing Architecture**

---

# **Testing Layers**

Tests  
├── Unit Tests  
├── Integration Tests  
├── Multiplayer Sync Tests  
└── UI Tests

---

# **Unit Tests**

Test:

* placement validation,  
* attacks,  
* sinking,  
* turn switching.

---

# **Multiplayer Tests**

Test:

* duplicate attacks,  
* room synchronization,  
* disconnect recovery,  
* cheating prevention.

---

# **Example Vitest Cases**

cannot overlap ships  
cannot attack same coordinate twice  
player cannot move during enemy turn  
winner detected correctly

---

# **15\. Security Architecture**

---

# **Multiplayer Security Rules**

Never trust client.

Server validates:

* attacks,  
* placements,  
* turn order,  
* room ownership.

---

# **Anti-Cheat Measures**

| Risk | Mitigation |
| ----- | ----- |
| fake hits | server validation |
| extra turns | authoritative turns |
| hidden board leak | partial state sync |
| replay attack | event validation |

---

# **16\. Performance Architecture**

---

# **Optimization Goals**

* minimal rerenders,  
* efficient socket traffic,  
* lightweight state updates.

---

# **Techniques**

## **Frontend**

* keyed lists,  
* isolated cells,  
* memoized derived state.

## **Backend**

* room-based broadcasting,  
* delta synchronization.

---

# **17\. Deployment Architecture**

---

# **Frontend Deployment**

## **Vercel**

### **Responsibilities**

* SvelteKit hosting  
* CDN  
* asset delivery

---

# **Backend Deployment**

## **Railway**

### **Responsibilities**

* Socket server  
* room management  
* game engine execution

---

# **Environment Variables**

PUBLIC\_SOCKET\_URL=  
NODE\_ENV=  
PORT=

---

# **18\. CI/CD Pipeline**

---

# **Recommended Pipeline**

GitHub Push  
   ↓  
Run Tests  
   ↓  
Build Frontend  
   ↓  
Build Backend  
   ↓  
Deploy Railway  
   ↓  
Deploy Vercel

---

# **19\. Scalability Plan**

---

# **Phase 1**

Single-player local.

---

# **Phase 2**

Online multiplayer.

---

# **Phase 3**

Persistent matchmaking.

---

# **Phase 4**

Accounts \+ ranking.

---

# **Phase 5**

Competitive features.

---

# **20\. Recommended MVP Scope**

---

# **Must Have**

✅ Single-player  
✅ AI opponent  
✅ Multiplayer rooms  
✅ Realtime attacks  
✅ Ship placement  
✅ Audio/animation  
✅ Responsive UI

---

# **Avoid Initially**

❌ chat  
❌ ranked matchmaking  
❌ persistence database  
❌ cosmetics  
❌ replay system
