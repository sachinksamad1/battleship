import { io, Socket } from 'socket.io-client';
import { writable, get } from 'svelte/store';
import { gameStore, setPhase, setTurn, setWinner } from '../stores/gameStore';
import { playerStore, enemyStore } from '../stores/playerStore';
import type { ShipState } from '../game/types';

export const socketStore = writable<Socket | null>(null);
export const roomIdStore = writable<string | null>(null);
export const joinCodeStore = writable<string | null>(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export function connectSocket() {
	const socket = io(SOCKET_URL);

	socket.on('connect', () => {
		console.log('Connected to server');
		socketStore.set(socket);
	});

	socket.on('room_created', ({ roomId, joinCode }) => {
		roomIdStore.set(roomId);
		joinCodeStore.set(joinCode);
		setPhase('matchmaking');
	});

	socket.on('player_joined', ({ players }) => {
		const opponent = players.find((p: { id: string; name: string }) => p.id !== socket.id);
		if (opponent) {
			enemyStore.update((s) => ({ ...s, name: opponent.name }));
		}
		if (players.length === 2) {
			setPhase('placement');
		}
	});

	socket.on('game_started', ({ turn }) => {
		setPhase('battle');
		setTurn(turn === socket.id ? 'player' : 'enemy');
	});

	socket.on('attack_result', ({ attackerId, coordinate, result, shipSunk }) => {
		const isMyAttack = attackerId === socket.id;
		const targetStore = isMyAttack ? enemyStore : playerStore;

		targetStore.update((s) => {
			const newBoard = s.board.map((row) => row.map((c) => ({ ...c })));
			newBoard[coordinate.y][coordinate.x].hit = true;
			if (result === 'hit') {
				newBoard[coordinate.y][coordinate.x].occupied = true;
			}

			let newShips = s.ships;
			if (shipSunk) {
				newShips = s.ships.map((ship) => (ship.id === shipSunk ? { ...ship, sunk: true } : ship));
			}

			return { ...s, board: newBoard, ships: newShips };
		});
	});

	socket.on('turn_changed', ({ turn }) => {
		setTurn(turn === socket.id ? 'player' : 'enemy');
	});

	socket.on('game_over', ({ winnerId }) => {
		setWinner(winnerId === socket.id ? 'player' : 'enemy');
		setPhase('result');
	});

	socket.on('player_left', () => {
		if (get(gameStore).phase === 'battle') {
			alert('Opponent disconnected. You win by forfeit!');
			setWinner('player');
			setPhase('result');
		} else {
			alert('Opponent left the room.');
			setPhase('menu');
			socket.disconnect();
		}
	});

	socket.on('disconnect', () => {
		socketStore.set(null);
	});

	return socket;
}

export function createRoom(playerName: string) {
	const socket = get(socketStore);
	if (socket) {
		socket.emit('create_room', { playerName });
	}
}

export function joinRoom(joinCode: string, playerName: string) {
	const socket = get(socketStore);
	if (socket) {
		socket.emit('join_room', { joinCode, playerName });
	}
}

export function emitAttack(coordinate: { x: number; y: number }) {
	const socket = get(socketStore);
	if (socket) {
		socket.emit('attack', { coordinate });
	}
}

export function emitShipsPlaced(ships: ShipState[]) {
	const socket = get(socketStore);
	if (socket) {
		socket.emit('place_ships', { ships });
	}
}
