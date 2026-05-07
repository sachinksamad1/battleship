import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { gameStore, resetGame, setTurn } from '../stores/gameStore';
import { playerStore, enemyStore } from '../stores/playerStore';
import { startSinglePlayerGame, handleAttack, startBattle } from './gameController';
import { placeShip } from './engine/placement';
import { FLEET_CONFIG } from './types';

describe('Game Controller', () => {
	beforeEach(() => {
		resetGame();
		playerStore.reset();
		enemyStore.reset();
	});

	it('should initialize single player game correctly', () => {
		startSinglePlayerGame();
		expect(get(gameStore).phase).toBe('placement');
		expect(get(gameStore).turn).toBe('player');
	});

	it('should not allow transition to battle if player is not ready', () => {
		startSinglePlayerGame();
		startBattle();
		expect(get(gameStore).phase).toBe('placement');
	});

	it('should transition to battle if player is ready', () => {
		startSinglePlayerGame();
		playerStore.setReady(true);
		startBattle();
		expect(get(gameStore).phase).toBe('battle');
	});

	it('should resolve attack and switch turns in battle phase', () => {
		startSinglePlayerGame();
		playerStore.setReady(true);
		startBattle();

		// Initial turn is 'player'
		handleAttack('enemy', { x: 0, y: 0 });

		expect(get(enemyStore).board[0][0].hit).toBe(true);
		expect(get(gameStore).turn).toBe('enemy');
	});

	it('should not allow attack in placement phase', () => {
		startSinglePlayerGame();
		handleAttack('enemy', { x: 0, y: 0 });
		expect(get(enemyStore).board[0][0].hit).toBe(false);
	});

	it('should detect win condition and transition to result phase', () => {
		startSinglePlayerGame();

		// Setup enemy with 1 ship of length 2
		const shipDef = FLEET_CONFIG.find((s) => s.id === 'destroyer')!;
		const boardWithShip = placeShip(get(enemyStore).board, shipDef, { x: 0, y: 0 }, 'H', 'dest-1');
		enemyStore.updateBoard(boardWithShip);
		enemyStore.setShips([
			{ id: 'dest-1', definitionId: 'destroyer', coordinates: [], hits: 0, sunk: false }
		]);

		playerStore.setReady(true);
		startBattle();

		// Attack 1
		handleAttack('enemy', { x: 0, y: 0 });
		expect(get(gameStore).phase).toBe('battle');

		// Manually set turn back to player for testing consecutive hits
		setTurn('player');

		// Attack 2 (Sink)
		handleAttack('enemy', { x: 1, y: 0 });

		expect(get(gameStore).phase).toBe('result');
		expect(get(gameStore).winner).toBe('player');
	});
});
