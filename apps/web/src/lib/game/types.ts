/**
 * Core TypeScript types and data structures for the Battleship game.
 */

export type Coordinate = {
  x: number; // 0-9 (Column A-J)
  y: number; // 0-9 (Row 1-10)
};

export type Cell = {
  occupied: boolean;   // True if a ship part is present
  shipId?: string;     // ID of the ship occupying this cell
  hit: boolean;        // True if the cell has been attacked
};

export type Board = Cell[][];

export type ShipDefinition = {
  id: string;          // e.g., "carrier", "battleship"
  name: string;        // Display name
  length: number;      // Number of cells occupied
};

export type ShipState = {
  id: string;
  definitionId: string; // References ShipDefinition
  coordinates: Coordinate[];
  hits: number;
  sunk: boolean;
};

export type GamePhase = 
  | "menu"
  | "placement"
  | "matchmaking"
  | "battle"
  | "result";

export type PlayerState = {
  id: string;
  name: string;
  board: Board;
  ships: ShipState[];
  attacks: Coordinate[];
  ready: boolean;
};

export type RoomPlayer = {
  id: string;
  name: string;
  socketId: string;
  ready: boolean;
  connected: boolean;
};

export type AIDifficulty = "easy" | "medium" | "hard" | "expert";

export type AIState = {
  difficulty: AIDifficulty;
  mode: "hunt" | "target";
  targetQueue: Coordinate[];
  probabilityMap?: number[][];
  previousAttacks: Coordinate[];
  sunkShipIds: string[];
};

export type AttackResult = {
  coordinate: Coordinate;
  result: "hit" | "miss";
  shipId?: string;
  shipSunk?: boolean;
};

export const BOARD_SIZE = 10;

export const FLEET_CONFIG: ShipDefinition[] = [
  { id: "carrier",     name: "Carrier",     length: 5 },
  { id: "battleship",  name: "Battleship",  length: 4 },
  { id: "cruiser",     name: "Cruiser",     length: 3 },
  { id: "submarine",   name: "Submarine",   length: 3 },
  { id: "destroyer",   name: "Destroyer",   length: 2 },
];
