import { describe, it, expect } from 'vitest';
import { createBoard } from './board.js';
import { placeShip } from './placement.js';
import { resolveAttack } from './attack.js';
import type { ShipDefinition } from '../types.js';

describe('Attack Engine', () => {
  const destroyer: ShipDefinition = { id: 'destroyer', name: 'Destroyer', length: 2 };

  it('should mark a cell as "hit" after an attack (Miss)', () => {
    const board = createBoard();
    const { board: newBoard, result } = resolveAttack(board, { x: 0, y: 0 });

    expect(result).toBe('miss');
    expect(newBoard[0][0].hit).toBe(true);
  });

  it('should return "hit" if the cell was occupied', () => {
    const board = createBoard();
    const boardWithShip = placeShip(board, destroyer, { x: 0, y: 0 }, 'H');
    const { result } = resolveAttack(boardWithShip, { x: 0, y: 0 });

    expect(result).toBe('hit');
  });

  it('should correctly identify when a ship is sunk', () => {
    const board = createBoard();
    const boardWithShip = placeShip(board, destroyer, { x: 0, y: 0 }, 'H', 'dest-1');

    // First attack: hit but not sunk
    const { board: boardAfterHit1, shipSunk: sunk1 } = resolveAttack(boardWithShip, { x: 0, y: 0 });
    expect(sunk1).toBeUndefined();

    // Second attack: hit and sunk
    const { shipSunk: sunk2 } = resolveAttack(boardAfterHit1, { x: 1, y: 0 });
    expect(sunk2).toBe('dest-1');
  });

  it('should prevent attacking the same coordinate twice', () => {
    const board = createBoard();
    const { board: newBoard } = resolveAttack(board, { x: 0, y: 0 });

    expect(() => resolveAttack(newBoard, { x: 0, y: 0 })).toThrow();
  });

  it('should throw error for out-of-bounds attacks', () => {
    const board = createBoard();
    expect(() => resolveAttack(board, { x: 10, y: 0 })).toThrow();
  });
});
