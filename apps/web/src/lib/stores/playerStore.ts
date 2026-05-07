import { writable } from 'svelte/store';
import type { Board, ShipState, Coordinate } from '../game/types';
import { createBoard } from '../game/engine/board';
import { FLEET_CONFIG } from '../game/types';

export type PlayerData = {
	id: string;
	name: string;
	board: Board;
	ships: ShipState[];
	attacks: Coordinate[];
	ready: boolean;
};

function createPlayerStore(id: string, name: string) {
	const initialShips: ShipState[] = FLEET_CONFIG.map((d) => ({
		id: d.id,
		definitionId: d.id,
		coordinates: [],
		hits: 0,
		sunk: false
	}));

	const initialState: PlayerData = {
		id,
		name,
		board: createBoard(),
		ships: initialShips,
		attacks: [],
		ready: false
	};

	const { subscribe, set, update } = writable<PlayerData>(initialState);

	return {
		subscribe,
		set,
		update,
		reset: () => set(initialState),
		updateBoard: (board: Board) => update((s) => ({ ...s, board })),
		addAttack: (coord: Coordinate) => update((s) => ({ ...s, attacks: [...s.attacks, coord] })),
		setShips: (ships: ShipState[]) => update((s) => ({ ...s, ships })),
		setReady: (ready: boolean) => update((s) => ({ ...s, ready }))
	};
}

export const playerStore = createPlayerStore('player', 'Player');
export const enemyStore = createPlayerStore('enemy', 'Opponent');
