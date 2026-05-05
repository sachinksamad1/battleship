import { describe, it, expect } from 'vitest';
import { createBoard } from '../engine/board';
import { selectAiMove, updateAiState, getNeighbors } from './aiEngine';
import type { AIState } from '../types';

describe('AI Engine', () => {
  const initialState: AIState = {
    difficulty: 'easy',
    mode: 'hunt',
    targetQueue: [],
    previousAttacks: [],
    sunkShipIds: []
  };

  it('should select a valid coordinate within the 10x10 grid', () => {
    const board = createBoard();
    const move = selectAiMove(board, 'easy', initialState);
    expect(move.x).toBeGreaterThanOrEqual(0);
    expect(move.x).toBeLessThan(10);
    expect(move.y).toBeGreaterThanOrEqual(0);
    expect(move.y).toBeLessThan(10);
  });

  it('should never select an already attacked coordinate', () => {
    const board = createBoard();
    // Mark almost all cells as hit
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (!(x === 5 && y === 5)) {
          board[y][x].hit = true;
        }
      }
    }
    const move = selectAiMove(board, 'easy', initialState);
    expect(move).toEqual({ x: 5, y: 5 });
  });

  it('should update state and enter target mode after a hit', () => {
    const state = updateAiState(initialState, { x: 5, y: 5 }, 'hit');
    expect(state.mode).toBe('target');
    expect(state.targetQueue.length).toBeGreaterThan(0);
    expect(state.targetQueue).toContainEqual({ x: 5, y: 4 }); // Up
  });

  it('should prioritize target queue in medium difficulty', () => {
    const board = createBoard();
    const state: AIState = {
      difficulty: 'medium',
      mode: 'target',
      targetQueue: [{ x: 1, y: 1 }],
      previousAttacks: [],
      sunkShipIds: []
    };
    const move = selectAiMove(board, 'medium', state);
    expect(move).toEqual({ x: 1, y: 1 });
  });

  it('should select a valid move in expert difficulty (Monte Carlo)', () => {
    const board = createBoard();
    const state: AIState = {
      difficulty: 'expert',
      mode: 'hunt',
      targetQueue: [],
      previousAttacks: [],
      sunkShipIds: []
    };
    const move = selectAiMove(board, 'expert', state);
    expect(move.x).toBeGreaterThanOrEqual(0);
    expect(move.x).toBeLessThan(10);
    expect(move.y).toBeGreaterThanOrEqual(0);
    expect(move.y).toBeLessThan(10);
  });

  it('should clear target queue and return to hunt mode after a ship is sunk', () => {
    const state: AIState = {
      difficulty: 'medium',
      mode: 'target',
      targetQueue: [{ x: 1, y: 1 }],
      previousAttacks: [],
      sunkShipIds: []
    };
    const updatedState = updateAiState(state, { x: 0, y: 0 }, 'hit', 'destroyer');
    expect(updatedState.mode).toBe('hunt');
    expect(updatedState.targetQueue).toEqual([]);
  });

  it('should correctly filter out-of-bounds neighbors', () => {
    const topCorner = { x: 0, y: 0 };
    const neighbors = getNeighbors(topCorner);
    expect(neighbors.length).toBe(2); // Only Down and Right
    expect(neighbors).toContainEqual({ x: 0, y: 1 });
    expect(neighbors).toContainEqual({ x: 1, y: 0 });
  });
});
