import { writable } from 'svelte/store';
import type { GamePhase } from '../game/types';

export type GameState = {
  phase: GamePhase;
  turn: string | null; // Player ID
  winner: string | null; // Player ID
};

const initialState: GameState = {
  phase: 'menu',
  turn: null,
  winner: null
};

export const gameStore = writable<GameState>(initialState);

export function setPhase(phase: GamePhase) {
  gameStore.update((state) => ({ ...state, phase }));
}

export function setTurn(turn: string | null) {
  gameStore.update((state) => ({ ...state, turn }));
}

export function setWinner(winner: string | null) {
  gameStore.update((state) => ({ ...state, winner }));
}

export function resetGame() {
  gameStore.set(initialState);
}
