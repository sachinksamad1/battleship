import { Server, Socket } from 'socket.io';
import type { Board, ShipState, Coordinate, GamePhase, PlayerState } from './game/types.js';
import { createBoard } from './game/engine/board.js';

export type Player = {
  id: string;
  name: string;
  socketId: string;
  ready: boolean;
  board: Board;
  ships: ShipState[];
};

export type Room = {
  id: string;
  joinCode: string;
  players: Player[];
  status: 'waiting' | 'placement' | 'battle' | 'finished';
  turn: string | null; // Player ID
  winner: string | null;
};

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private socketToRoom: Map<string, string> = new Map();

  constructor(private io: Server) {}

  createRoom(socket: Socket, playerName: string): Room {
    const roomId = Math.random().toString(36).substring(2, 9);
    const joinCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const room: Room = {
      id: roomId,
      joinCode,
      players: [{
        id: socket.id,
        name: playerName,
        socketId: socket.id,
        ready: false,
        board: createBoard(),
        ships: []
      }],
      status: 'waiting',
      turn: null,
      winner: null
    };

    this.rooms.set(roomId, room);
    this.socketToRoom.set(socket.id, roomId);
    socket.join(roomId);

    return room;
  }

  joinRoom(socket: Socket, joinCode: string, playerName: string): Room | null {
    let room: Room | undefined;
    for (const r of this.rooms.values()) {
      if (r.joinCode === joinCode) {
        room = r;
        break;
      }
    }

    if (!room || room.players.length >= 2 || room.status !== 'waiting') {
      return null;
    }

    const player: Player = {
      id: socket.id,
      name: playerName,
      socketId: socket.id,
      ready: false,
      board: createBoard(),
      ships: []
    };

    room.players.push(player);
    this.socketToRoom.set(socket.id, room.id);
    socket.join(room.id);

    return room;
  }

  leaveRoom(socketId: string): string | null {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (room) {
      room.players = room.players.filter(p => p.socketId !== socketId);
      if (room.players.length === 0) {
        this.rooms.delete(roomId);
      }
    }

    this.socketToRoom.delete(socketId);
    return roomId;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getRoomBySocketId(socketId: string): Room | undefined {
    const roomId = this.socketToRoom.get(socketId);
    return roomId ? this.getRoom(roomId) : undefined;
  }
}
