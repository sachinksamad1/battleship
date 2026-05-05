import type { Board, Coordinate, ShipDefinition } from '../types.js';
import { getCell } from './board.js';

export type Orientation = 'H' | 'V';

/**
 * Validates if a ship can be placed at the given coordinate and orientation.
 * @param board The current game board.
 * @param ship The ship definition to place.
 * @param coord The starting coordinate (top-left).
 * @param orientation The orientation ('H' for Horizontal, 'V' for Vertical).
 * @returns True if the placement is valid, false otherwise.
 */
export function validatePlacement(
  board: Board,
  ship: ShipDefinition,
  coord: Coordinate,
  orientation: Orientation
): boolean {
  const { x, y } = coord;

  for (let i = 0; i < ship.length; i++) {
    const currentCoord: Coordinate = {
      x: orientation === 'H' ? x + i : x,
      y: orientation === 'V' ? y + i : y
    };

    const cell = getCell(board, currentCoord);

    // Out of bounds
    if (!cell) {
      return false;
    }

    // Overlaps another ship
    if (cell.occupied) {
      return false;
    }
  }

  return true;
}

/**
 * Places a ship on the board.
 * @param board The current game board.
 * @param ship The ship definition to place.
 * @param coord The starting coordinate.
 * @param orientation The orientation.
 * @param shipId Optional unique ID for the ship instance.
 * @returns A new Board with the ship placed.
 * @throws Error if the placement is invalid.
 */
export function placeShip(
  board: Board,
  ship: ShipDefinition,
  coord: Coordinate,
  orientation: Orientation,
  shipId?: string
): Board {
  if (!validatePlacement(board, ship, coord, orientation)) {
    throw new Error(`Invalid ship placement at (${coord.x}, ${coord.y}) with orientation ${orientation}`);
  }

  // Create a deep copy of the board to remain "pure"
  const newBoard: Board = board.map((row) => row.map((cell) => ({ ...cell })));
  const { x, y } = coord;
  const id = shipId || ship.id;

  for (let i = 0; i < ship.length; i++) {
    const currentX = orientation === 'H' ? x + i : x;
    const currentY = orientation === 'V' ? y + i : y;
    
    newBoard[currentY][currentX] = {
      ...newBoard[currentY][currentX],
      occupied: true,
      shipId: id
    };
  }

  return newBoard;
}
