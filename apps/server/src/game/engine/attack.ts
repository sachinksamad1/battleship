import type { Board, Coordinate } from '../types.js';
import { getCell } from './board.js';

export type AttackResult = {
  board: Board;
  result: 'hit' | 'miss';
  shipSunk?: string;
};

/**
 * Resolves an attack at the given coordinate.
 * @param board The current board state.
 * @param coord The coordinate being attacked.
 * @returns The new board state, the result of the attack, and the ID of the ship if it was sunk.
 * @throws Error if the attack is invalid (out of bounds or already attacked).
 */
export function resolveAttack(board: Board, coord: Coordinate): AttackResult {
  const cell = getCell(board, coord);

  if (!cell) {
    throw new Error(`Attack out of bounds at (${coord.x}, ${coord.y})`);
  }

  if (cell.hit) {
    throw new Error(`Coordinate (${coord.x}, ${coord.y}) has already been attacked`);
  }

  // Create a deep copy of the board
  const newBoard: Board = board.map((row) => row.map((c) => ({ ...c })));
  const { x, y } = coord;
  const targetCell = newBoard[y][x];

  targetCell.hit = true;

  const result = targetCell.occupied ? 'hit' : 'miss';
  let shipSunk: string | undefined;

  if (result === 'hit' && targetCell.shipId) {
    const shipId = targetCell.shipId;
    // Check if any other cells of this ship are still not hit
    const isShipStillAlive = newBoard.some((row) =>
      row.some((c) => c.shipId === shipId && !c.hit)
    );

    if (!isShipStillAlive) {
      shipSunk = shipId;
    }
  }

  return {
    board: newBoard,
    result,
    shipSunk
  };
}
