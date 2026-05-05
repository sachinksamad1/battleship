import { describe, it, expect } from 'vitest';
import { createBoard, getCell } from './board';
import { BOARD_SIZE } from '../types';

describe('Board Engine', () => {
  it('should create a 10x10 grid by default', () => {
    const board = createBoard();
    expect(board.length).toBe(BOARD_SIZE);
    expect(board[0].length).toBe(BOARD_SIZE);
  });

  it('should initialize all cells as empty and not hit', () => {
    const board = createBoard();
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        expect(board[y][x]).toEqual({
          occupied: false,
          hit: false
        });
      }
    }
  });

  it('should return the correct cell for valid coordinates', () => {
    const board = createBoard();
    const cell = getCell(board, { x: 0, y: 0 });
    expect(cell).not.toBeNull();
    expect(cell?.occupied).toBe(false);
  });

  it('should return null for out-of-bounds coordinates', () => {
    const board = createBoard();
    expect(getCell(board, { x: -1, y: 0 })).toBeNull();
    expect(getCell(board, { x: 0, y: -1 })).toBeNull();
    expect(getCell(board, { x: BOARD_SIZE, y: 0 })).toBeNull();
    expect(getCell(board, { x: 0, y: BOARD_SIZE })).toBeNull();
  });
});
