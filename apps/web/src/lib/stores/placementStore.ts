import { writable } from 'svelte/store';
import type { ShipDefinition, Coordinate } from '../game/types';

export type PlacedShip = {
	definition: ShipDefinition;
	coord: Coordinate;
	orientation: 'H' | 'V';
};

export type PlacementState = {
	placedShips: PlacedShip[];
	selectedShip: ShipDefinition | null;
	currentOrientation: 'H' | 'V';
};

const initialState: PlacementState = {
	placedShips: [],
	selectedShip: null,
	currentOrientation: 'H'
};

export const placementStore = writable<PlacementState>(initialState);

export function selectShip(ship: ShipDefinition | null) {
	placementStore.update((s) => ({ ...s, selectedShip: ship }));
}

export function rotateShip() {
	placementStore.update((s) => ({
		...s,
		currentOrientation: s.currentOrientation === 'H' ? 'V' : 'H'
	}));
}

export function addPlacedShip(placedShip: PlacedShip) {
	placementStore.update((s) => ({
		...s,
		placedShips: [...s.placedShips, placedShip],
		selectedShip: null
	}));
}

export function removePlacedShip(shipId: string) {
	placementStore.update((s) => ({
		...s,
		placedShips: s.placedShips.filter((ps) => ps.definition.id !== shipId)
	}));
}

export function resetPlacement() {
	placementStore.set(initialState);
}
