import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './roomManager.js';
import { resolveAttack } from './game/engine/attack.js';
import { isGameOver } from './game/engine/win.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const roomManager = new RoomManager(io);

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('create_room', ({ playerName }) => {
    const room = roomManager.createRoom(socket, playerName);
    socket.emit('room_created', {
      roomId: room.id,
      playerId: socket.id,
      joinCode: room.joinCode,
    });
  });

  socket.on('join_room', ({ joinCode, playerName }) => {
    const room = roomManager.joinRoom(socket, joinCode, playerName);
    if (room) {
      io.to(room.id).emit('player_joined', {
        roomId: room.id,
        players: room.players.map((p) => ({ id: p.id, name: p.name, ready: p.ready })),
      });

      if (room.players.length === 2) {
        room.status = 'placement';
        io.to(room.id).emit('phase_changed', 'placement');
      }
    } else {
      socket.emit('error', { message: 'Room not found or full' });
    }
  });

  socket.on('place_ships', ({ ships }) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) return;

    const player = room.players.find((p) => p.socketId === socket.id);
    if (player) {
      player.ships = ships;
      player.ready = true;

      // Populate board from ships for server-side validation
      ships.forEach((ship) => {
        ship.coordinates.forEach((coord) => {
          if (player.board[coord.y] && player.board[coord.y][coord.x]) {
            player.board[coord.y][coord.x].occupied = true;
            player.board[coord.y][coord.x].shipId = ship.id;
          }
        });
      });

      socket.emit('ships_placed', { playerId: socket.id });

      const allReady = room.players.length === 2 && room.players.every((p) => p.ready);
      if (allReady) {
        room.status = 'battle';
        room.turn = room.players[0].id; // First player starts
        io.to(room.id).emit('game_started', {
          turn: room.turn,
          phase: 'battle',
        });
      }
    }
  });

  socket.on('attack', ({ coordinate }) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room || room.status !== 'battle' || room.turn !== socket.id) return;

    const targetPlayer = room.players.find((p) => p.socketId !== socket.id);
    if (!targetPlayer) return;

    try {
      const result = resolveAttack(targetPlayer.board, coordinate);
      targetPlayer.board = result.board;

      if (result.shipSunk) {
        targetPlayer.ships = targetPlayer.ships.map((s) =>
          s.id === result.shipSunk ? { ...s, sunk: true } : s
        );
      }

      io.to(room.id).emit('attack_result', {
        attackerId: socket.id,
        coordinate,
        result: result.result,
        shipSunk: result.shipSunk,
      });

      if (isGameOver(targetPlayer.ships)) {
        room.status = 'finished';
        room.winner = socket.id;
        io.to(room.id).emit('game_over', { winnerId: socket.id });
        return;
      }

      room.turn = targetPlayer.id;
      io.to(room.id).emit('turn_changed', { turn: room.turn });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      socket.emit('error', { message });
    }
  });

  socket.on('disconnect', () => {
    const roomId = roomManager.leaveRoom(socket.id);
    if (roomId) {
      io.to(roomId).emit('player_left', { playerId: socket.id });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
