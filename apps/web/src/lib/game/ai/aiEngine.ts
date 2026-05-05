import type { Board, Coordinate, AIDifficulty, AIState, ShipDefinition, ShipState } from '../types';
import { BOARD_SIZE, FLEET_CONFIG } from '../types';
import { createBoard } from '../engine/board';
import { placeShip, validatePlacement } from '../engine/placement';

/**
 * Gets a random valid coordinate from the board.
 * @param board The current board.
 * @returns A random Coordinate.
 */
export function getRandomCoordinate(board: Board): Coordinate {
  const x = Math.floor(Math.random() * BOARD_SIZE);
  const y = Math.floor(Math.random() * BOARD_SIZE);
  return { x, y };
}

/**
 * Gets a list of valid neighbors (up, down, left, right) for a given coordinate.
 */
export function getNeighbors(coord: Coordinate): Coordinate[] {
  const { x, y } = coord;
  const neighbors: Coordinate[] = [
    { x, y: y - 1 }, // Up
    { x, y: y + 1 }, // Down
    { x: x - 1, y }, // Left
    { x: x + 1, y }  // Right
  ];

  return neighbors.filter(
    (c) => c.x >= 0 && c.x < BOARD_SIZE && c.y >= 0 && c.y < BOARD_SIZE
  );
}

/**
 * Creates a probability map based on where ships could potentially fit.
 */
function createProbabilityMap(board: Board, shipLengths: number[]): number[][] {
  const map: number[][] = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));

  for (const length of shipLengths) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        // Horizontal check
        if (x + length <= BOARD_SIZE) {
          let canFit = true;
          for (let i = 0; i < length; i++) {
            if (board[y][x + i].hit && !board[y][x + i].occupied) {
              canFit = false;
              break;
            }
          }
          if (canFit) {
            for (let i = 0; i < length; i++) {
              map[y][x + i]++;
            }
          }
        }
        // Vertical check
        if (y + length <= BOARD_SIZE) {
          let canFit = true;
          for (let i = 0; i < length; i++) {
            if (board[y + i][x].hit && !board[y + i][x].occupied) {
              canFit = false;
              break;
            }
          }
          if (canFit) {
            for (let i = 0; i < length; i++) {
              map[y + i][x]++;
            }
          }
        }
      }
    }
  }
  return map;
}

/**
 * Creates a Monte Carlo probability map by simulating random valid board placements.
 */
function createMonteCarloMap(board: Board, shipDefinitions: ShipDefinition[]): number[][] {
  const map: number[][] = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
  const simulations = 1000;
  
  const hitsToCover: Coordinate[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x].hit && board[y][x].occupied) {
        hitsToCover.push({ x, y });
      }
    }
  }

  let successfulSimulations = 0;
  for (let i = 0; i < simulations; i++) {
    const simOccupied = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(false));
    let possible = true;

    // Shuffle ships for random placement order
    const shuffledShips = [...shipDefinitions].sort(() => Math.random() - 0.5);

    for (const ship of shuffledShips) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 50) {
        attempts++;
        const x = Math.floor(Math.random() * BOARD_SIZE);
        const y = Math.floor(Math.random() * BOARD_SIZE);
        const orientation = Math.random() > 0.5 ? 'H' : 'V';

        let canPlace = true;
        for (let l = 0; l < ship.length; l++) {
          const cx = orientation === 'H' ? x + l : x;
          const cy = orientation === 'V' ? y + l : y;

          if (cx >= BOARD_SIZE || cy >= BOARD_SIZE || simOccupied[cy][cx]) {
            canPlace = false;
            break;
          }
          if (board[cy][cx].hit && !board[cy][cx].occupied) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let l = 0; l < ship.length; l++) {
            const cx = orientation === 'H' ? x + l : x;
            const cy = orientation === 'V' ? y + l : y;
            simOccupied[cy][cx] = true;
          }
          placed = true;
        }
      }

      if (!placed) {
        possible = false;
        break;
      }
    }

    if (possible) {
      const allHitsCovered = hitsToCover.every(h => simOccupied[h.y][h.x]);
      if (allHitsCovered) {
        successfulSimulations++;
        for (let y = 0; y < BOARD_SIZE; y++) {
          for (let x = 0; x < BOARD_SIZE; x++) {
            if (simOccupied[y][x]) {
              map[y][x]++;
            }
          }
        }
      }
    }
  }

  if (successfulSimulations < 10) {
    return createProbabilityMap(board, shipDefinitions.map(s => s.length));
  }

  return map;
}

/**
 * Main AI function to select the next move.
 */
export function selectAiMove(
  board: Board,
  difficulty: AIDifficulty,
  aiState: AIState
): Coordinate {
  const availableMoves: Coordinate[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!board[y][x].hit) {
        availableMoves.push({ x, y });
      }
    }
  }

  if (availableMoves.length === 0) {
    throw new Error('No moves available for AI');
  }

  if (difficulty === 'easy') {
    const index = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[index];
  }

  if (aiState.targetQueue.length > 0) {
    for (const target of aiState.targetQueue) {
      if (!board[target.y][target.x].hit) {
        return target;
      }
    }
  }

  if (difficulty === 'medium') {
    const index = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[index];
  }

  // Hard & Expert Logic
  const sunkIds = new Set(aiState.sunkShipIds || []);
  const remainingShips = FLEET_CONFIG.filter(s => !sunkIds.has(s.id));
  
  let probabilityMap: number[][];
  if (difficulty === 'expert') {
    probabilityMap = createMonteCarloMap(board, remainingShips);
  } else {
    probabilityMap = createProbabilityMap(board, remainingShips.map(s => s.length));
  }
  
  let huntMoves = availableMoves;
  const parityMoves = availableMoves.filter(m => (m.x + m.y) % 2 === 0);
  
  if (parityMoves.length > 0) {
    huntMoves = parityMoves;
  }

  let bestMove = huntMoves[0];
  let maxProb = -1;

  for (const move of huntMoves) {
    const prob = probabilityMap[move.y][move.x];
    if (prob > maxProb) {
      maxProb = prob;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Updates the AI state based on the result of an attack.
 */
export function updateAiState(
  currentState: AIState,
  lastAttack: Coordinate,
  result: 'hit' | 'miss',
  shipSunk?: string
): AIState {
  const newState = { ...currentState };
  newState.previousAttacks = [...newState.previousAttacks, lastAttack];
  newState.sunkShipIds = [...(newState.sunkShipIds || [])];

  if (result === 'hit') {
    newState.mode = 'target';
    const neighbors = getNeighbors(lastAttack);
    newState.targetQueue = [...neighbors, ...newState.targetQueue];
  }

  if (shipSunk) {
    newState.mode = 'hunt';
    newState.targetQueue = [];
    newState.sunkShipIds.push(shipSunk);
  }

  return newState;
}

/**
 * Generates an initial fleet layout for the AI based on difficulty.
 */
export function generateAiFleet(difficulty: AIDifficulty): { board: Board; ships: ShipState[] } {
  const MAX_ATTEMPTS = 500;
  
  const attemptPlacement = (strategy: AIDifficulty): { board: Board; ships: ShipState[] } | null => {
    let board = createBoard();
    const ships: ShipState[] = [];
    
    // Hard Strategy: Pre-place a decoy (two ships touching)
    let decoyPlaced = false;

    for (const shipDef of FLEET_CONFIG) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < MAX_ATTEMPTS) {
        attempts++;
        let x = Math.floor(Math.random() * BOARD_SIZE);
        let y = Math.floor(Math.random() * BOARD_SIZE);
        const orientation = Math.random() > 0.5 ? 'H' : 'V';

        // Hard/Expert: Weight towards center (1-8 range)
        if ((strategy === 'hard' || strategy === 'expert') && Math.random() > 0.3) {
           x = 1 + Math.floor(Math.random() * (BOARD_SIZE - 2));
           y = 1 + Math.floor(Math.random() * (BOARD_SIZE - 2));
        }

        const canPlace = validatePlacement(board, shipDef, { x, y }, orientation);
        if (!canPlace) continue;

        // Medium/Hard/Expert: Enforce Spacing (no ships touching)
        // Except for Hard strategy where we want ONE decoy pair
        let spacingViolated = false;
        if (strategy !== 'easy') {
          const isDecoyAttempt = strategy === 'hard' && !decoyPlaced && ships.length > 0;
          
          if (!isDecoyAttempt) {
            // Standard spacing check: no neighbors can be occupied
            for (let i = 0; i < shipDef.length; i++) {
              const cx = orientation === 'H' ? x + i : x;
              const cy = orientation === 'V' ? y + i : y;
              
              const neighbors = [
                { x: cx + 1, y: cy }, { x: cx - 1, y: cy },
                { x: cx, y: cy + 1 }, { x: cx, y: cy - 1 },
                { x: cx + 1, y: cy + 1 }, { x: cx - 1, y: cy - 1 },
                { x: cx + 1, y: cy - 1 }, { x: cx - 1, y: cy + 1 }
              ];
              
              for (const n of neighbors) {
                if (n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE) {
                  if (board[n.y][n.x].occupied) {
                    spacingViolated = true;
                    break;
                  }
                }
              }
              if (spacingViolated) break;
            }
          } else {
            // Force this ship to touch another ship
            let touches = false;
            for (let i = 0; i < shipDef.length; i++) {
              const cx = orientation === 'H' ? x + i : x;
              const cy = orientation === 'V' ? y + i : y;
              const neighbors = [{ x: cx + 1, y: cy }, { x: cx - 1, y: cy }, { x: cx, y: cy + 1 }, { x: cx, y: cy - 1 }];
              for (const n of neighbors) {
                if (n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE && board[n.y][n.x].occupied) {
                  touches = true;
                  break;
                }
              }
              if (touches) break;
            }
            if (!touches) spacingViolated = true; // Reject if it doesn't touch
            else decoyPlaced = true;
          }
        }

        if (spacingViolated) continue;

        const shipId = shipDef.id;
        board = placeShip(board, shipDef, { x, y }, orientation, shipId);
        
        const coords: Coordinate[] = [];
        for (let i = 0; i < shipDef.length; i++) {
          coords.push({
            x: orientation === 'H' ? x + i : x,
            y: orientation === 'V' ? y + i : y
          });
        }

        ships.push({
          id: shipId,
          definitionId: shipDef.id,
          coordinates: coords,
          hits: 0,
          sunk: false
        });
        placed = true;
      }

      if (!placed) return null; // Failed to place all ships
    }
    return { board, ships };
  };

  if (difficulty === 'expert') {
    // Generate 50 boards and pick the one with the best "Defensive Score"
    let bestResult = attemptPlacement('expert');
    let bestScore = -1;

    for (let i = 0; i < 50; i++) {
      const res = attemptPlacement('expert');
      if (!res) continue;

      // Score: Prefer layouts with balanced quadrants and few ships on even-sum (parity) tiles
      let score = 0;
      const quadrants = [0, 0, 0, 0]; // TL, TR, BL, BR
      res.ships.forEach(s => {
        s.coordinates.forEach(c => {
          const qi = (c.x < 5 ? 0 : 1) + (c.y < 5 ? 0 : 2);
          quadrants[qi]++;
          if ((c.x + c.y) % 2 !== 0) score += 5; // Reward staying OFF the primary parity line
        });
      });
      
      // Reward balance
      const minQ = Math.min(...quadrants);
      score += minQ * 10;

      if (score > bestScore) {
        bestScore = score;
        bestResult = res;
      }
    }
    return bestResult || { board: createBoard(), ships: [] };
  }

  // Fallback / standard
  return attemptPlacement(difficulty) || attemptPlacement('easy') || { board: createBoard(), ships: [] };
}
