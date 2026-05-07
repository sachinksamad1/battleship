import { createBoard } from './game/engine/board.js';
export class RoomManager {
    constructor(io) {
        this.io = io;
        this.rooms = new Map();
        this.socketToRoom = new Map();
    }
    createRoom(socket, playerName) {
        const roomId = Math.random().toString(36).substring(2, 9);
        const joinCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        const room = {
            id: roomId,
            joinCode,
            players: [
                {
                    id: socket.id,
                    name: playerName,
                    socketId: socket.id,
                    ready: false,
                    board: createBoard(),
                    ships: [],
                },
            ],
            status: 'waiting',
            turn: null,
            winner: null,
        };
        this.rooms.set(roomId, room);
        this.socketToRoom.set(socket.id, roomId);
        socket.join(roomId);
        return room;
    }
    joinRoom(socket, joinCode, playerName) {
        let room;
        for (const r of this.rooms.values()) {
            if (r.joinCode === joinCode) {
                room = r;
                break;
            }
        }
        if (!room || room.players.length >= 2 || room.status !== 'waiting') {
            return null;
        }
        const player = {
            id: socket.id,
            name: playerName,
            socketId: socket.id,
            ready: false,
            board: createBoard(),
            ships: [],
        };
        room.players.push(player);
        this.socketToRoom.set(socket.id, room.id);
        socket.join(room.id);
        return room;
    }
    leaveRoom(socketId) {
        const roomId = this.socketToRoom.get(socketId);
        if (!roomId)
            return null;
        const room = this.rooms.get(roomId);
        if (room) {
            room.players = room.players.filter((p) => p.socketId !== socketId);
            if (room.players.length === 0) {
                this.rooms.delete(roomId);
            }
        }
        this.socketToRoom.delete(socketId);
        return roomId;
    }
    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
    getRoomBySocketId(socketId) {
        const roomId = this.socketToRoom.get(socketId);
        return roomId ? this.getRoom(roomId) : undefined;
    }
}
