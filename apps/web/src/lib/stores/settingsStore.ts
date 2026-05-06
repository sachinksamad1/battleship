import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Settings = {
  soundEnabled: boolean;
  animationsEnabled: boolean;
};

const defaultSettings: Settings = {
  soundEnabled: true,
  animationsEnabled: true
};

// Load initial state from localStorage if in browser
const initialSettings = browser 
  ? JSON.parse(localStorage.getItem('battleship-settings') || JSON.stringify(defaultSettings))
  : defaultSettings;

export const settingsStore = writable<Settings>(initialSettings);

// Subscribe to changes and persist to localStorage
if (browser) {
  settingsStore.subscribe((value) => {
    localStorage.setItem('battleship-settings', JSON.stringify(value));
  });
}

export function toggleSound() {
  settingsStore.update((s) => ({ ...s, soundEnabled: !s.soundEnabled }));
}

export function toggleAnimations() {
  settingsStore.update((s) => ({ ...s, animationsEnabled: !s.animationsEnabled }));
}
