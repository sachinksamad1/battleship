import { get } from 'svelte/store';
import { gameStore, setPhase, setTurn, setWinner } from '../stores/gameStore';
import { playerStore, enemyStore } from '../stores/playerStore';
import { aiStore, resetAI } from '../stores/aiStore';
import { resolveAttack } from './engine/attack';
import { isGameOver } from './engine/win';
import { socketStore, emitAttack } from '../socket/client';
import { audioManager } from '../audio/audioManager';
import type { Coordinate } from './types';
import * as Comlink from 'comlink';
import type { AIEngineWorker } from './ai/aiWorker';

let aiWorkerApi: Comlink.Remote<AIEngineWorker> | null = null;

function getAiWorker() {
	if (typeof window === 'undefined') return null;
	if (!aiWorkerApi) {
		const worker = new Worker(new URL('./ai/aiWorker.ts', import.meta.url), { type: 'module' });
		aiWorkerApi = Comlink.wrap<AIEngineWorker>(worker);
	}
	return aiWorkerApi;
}

/**
 * Initializes a new single-player game.
 */
export function startSinglePlayerGame() {
	playerStore.reset();
	enemyStore.reset();
	resetAI();
	setPhase('placement');
	setTurn('player');
	audioManager.play('cannon');
}

/**
 * Transition to battle phase.
 */
export function startBattle() {
	const p1Ready = get(playerStore).ready;
	// In single player, AI is auto-ready
	if (p1Ready) {
		setPhase('battle');
	}
}

/**
 * Automatically places enemy ships based on the current difficulty using the AI Worker.
 */
export async function setupEnemyFleet() {
	const aiApi = getAiWorker();
	if (!aiApi) return;

	const currentAiState = get(aiStore);
	try {
		const { board, ships } = await aiApi.generateAiFleet(currentAiState.difficulty);
		enemyStore.updateBoard(board);
		enemyStore.setShips(ships);
		enemyStore.setReady(true);
	} catch (error) {
		console.error('Failed to setup enemy fleet:', error);
	}
}

/**
 * Handles an attack from the current player.
 */
export async function handleAttack(targetId: 'player' | 'enemy', coord: Coordinate) {
	const { phase, turn, winner } = get(gameStore);

	if (phase !== 'battle' || winner || turn !== (targetId === 'enemy' ? 'player' : 'enemy')) {
		return;
	}

	const socket = get(socketStore);
	if (socket) {
		// Multiplayer path
		emitAttack(coord);
		return;
	}

	const targetStore = targetId === 'player' ? playerStore : enemyStore;
	const targetData = get(targetStore);

	try {
		// Sound: Cannon Fire
		audioManager.play('cannon');

		const result = resolveAttack(targetData.board, coord);
		targetStore.updateBoard(result.board);

		// Sound: Hit or Miss
		if (result.result === 'hit') {
			audioManager.play('explosion');
		} else {
			audioManager.play('splash');
		}

		if (result.shipSunk) {
			const updatedShips = targetData.ships.map((s) =>
				s.id === result.shipSunk ? { ...s, sunk: true } : s
			);
			targetStore.setShips(updatedShips);
		}

		if (isGameOver(get(targetStore).ships)) {
			setWinner(get(gameStore).turn);
			setPhase('result');
			audioManager.play('victory');
			return;
		}

		// Switch turn
		const nextTurn = targetId;
		setTurn(nextTurn);

		// If it's now the AI's turn, trigger it
		if (nextTurn === 'enemy') {
			await handleAiTurn();
		}
	} catch (error) {
		console.error('Invalid attack:', error);
	}
}

/**
 * Logic for the AI to take its turn.
 */
async function handleAiTurn() {
	const aiApi = getAiWorker();
	if (!aiApi) return;

	// Add a small delay for "thinking"
	await new Promise((resolve) => setTimeout(resolve, 600));

	const playerBoard = get(playerStore).board;
	const currentAiState = get(aiStore);

	try {
		// Sound: Cannon Fire (AI)
		audioManager.play('cannon');

		const move = await aiApi.selectAiMove(playerBoard, currentAiState.difficulty, currentAiState);
		const result = resolveAttack(playerBoard, move);

		// Update player board
		playerStore.updateBoard(result.board);

		// Sound: Hit or Miss (AI)
		if (result.result === 'hit') {
			audioManager.play('explosion');
		} else {
			audioManager.play('splash');
		}

		if (result.shipSunk) {
			const updatedShips = get(playerStore).ships.map((s) =>
				s.id === result.shipSunk ? { ...s, sunk: true } : s
			);
			playerStore.setShips(updatedShips);
		}

		// Update AI internal state
		const nextAiState = await aiApi.updateAiState(
			currentAiState,
			move,
			result.result,
			result.shipSunk
		);
		aiStore.set(nextAiState);

		// Check game over
		if (isGameOver(get(playerStore).ships)) {
			setWinner('enemy');
			setPhase('result');
			audioManager.play('defeat');
			return;
		}

		// Return turn to player
		setTurn('player');
	} catch (error) {
		console.error('AI Turn Error:', error);
	}
}
