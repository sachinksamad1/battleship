import { describe, it, expect } from 'vitest';
import { createBoard } from './board';
import { validatePlacement, placeShip } from './placement';
import type { ShipDefinition } from '../types';

describe('Ship Placement Engine', () => {
  const carrier: ShipDefinition = { id: 'carrier', name: 'Carrier', length: 5 };
  const destroyer: ShipDefinition = { id: 'destroyer', name: 'Destroyer', length: 2 };

  it('should allow valid horizontal placement', () => {
    const board = createBoard();
    const isValid = validatePlacement(board, destroyer, { x: 0, y: 0 }, 'H');
    expect(isValid).toBe(true);
  });

  it('should allow valid vertical placement', () => {
    const board = createBoard();
    const isValid = validatePlacement(board, destroyer, { x: 0, y: 0 }, 'V');
    expect(isValid).toBe(true);
  });

  it('should reject placement that goes out of bounds (Right)', () => {
    const board = createBoard();
    const isValid = validatePlacement(board, carrier, { x: 6, y: 0 }, 'H');
    expect(isValid).toBe(false);
  });

  it('should reject placement that goes out of bounds (Bottom)', () => {
    const board = createBoard();
    const isValid = validatePlacement(board, carrier, { x: 0, y: 6 }, 'V');
    expect(isValid).toBe(false);
  });

  it('should reject placement that overlaps an existing ship', () => {
    const board = createBoard();
    const boardWithShip = placeShip(board, destroyer, { x: 0, y: 0 }, 'H');
    const isValid = validatePlacement(boardWithShip, carrier, { x: 0, y: 0 }, 'V');
    expect(isValid).toBe(false);
  });

  it('should correctly place a ship and mark cells as occupied', () => {
    const board = createBoard();
    const boardWithShip = placeShip(board, destroyer, { x: 2, y: 2 }, 'H', 'dest-1');
    
    expect(boardWithShip[2][2].occupied).toBe(true);
    expect(boardWithShip[2][2].shipId).toBe('dest-1');
    expect(boardWithShip[2][3].occupied).toBe(true);
    expect(boardWithShip[2][3].shipId).toBe('dest-1');
    expect(boardWithShip[2][4].occupied).toBe(false);
  });

  it('should throw an error for invalid placement in placeShip', () => {
    const board = createBoard();
    expect(() => placeShip(board, carrier, { x: 8, y: 0 }, 'H')).toThrow();
  });
});
