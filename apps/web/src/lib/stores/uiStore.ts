import { writable } from 'svelte/store';

export type UIState = {
  soundEnabled: boolean;
  highPerformanceMode: boolean;
  theme: 'light' | 'dark' | 'system';
  showGridNumbers: boolean;
};

const initialState: UIState = {
  soundEnabled: true,
  highPerformanceMode: false,
  theme: 'system',
  showGridNumbers: true
};

export const uiStore = writable<UIState>(initialState);

export function toggleSound() {
  uiStore.update((s) => ({ ...s, soundEnabled: !s.soundEnabled }));
}

export function togglePerformance() {
  uiStore.update((s) => ({ ...s, highPerformanceMode: !s.highPerformanceMode }));
}

export function setTheme(theme: UIState['theme']) {
  uiStore.update((s) => ({ ...s, theme }));
}
