import { writable } from 'svelte/store';
import type { AIState } from '../game/types';

export const initialAIState: AIState = {
  difficulty: 'medium',
  mode: 'hunt',
  targetQueue: [],
  previousAttacks: [],
  sunkShipIds: []
};

export const aiStore = writable<AIState>(initialAIState);

export function resetAI() {
  aiStore.set(initialAIState);
}

export function setAIDifficulty(difficulty: AIState['difficulty']) {
  aiStore.update((s) => ({ ...s, difficulty }));
}
