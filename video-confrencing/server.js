const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  let currentRoom = null;

  socket.on("join-room", (roomId) => {
    currentRoom = roomId;
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId).add(socket.id);

    socket.emit("room-status", {
      isHost: rooms.get(roomId).size === 1,
      userCount: rooms.get(roomId).size,
    });

    console.log(`User ${socket.id} joined room ${roomId}`);

    if (rooms.get(roomId).size === 2) {
      const users = Array.from(rooms.get(roomId));
      const otherUser = users.find((id) => id !== socket.id);

      socket.to(otherUser).emit("user-connected", socket.id);
      socket.emit("user-connected", otherUser);
    }
  });

  socket.on("offer", (data) => {
    console.log(`Relaying offer from ${socket.id} to ${data.to}`);
    socket.to(data.to).emit("offer", {
      offer: data.offer,
      from: socket.id,
    });
  });

  socket.on("answer", (data) => {
    console.log(`Relaying answer from ${socket.id} to ${data.to}`);
    socket.to(data.to).emit("answer", {
      answer: data.answer,
      from: socket.id,
    });
  });

  socket.on("ice-candidate", (data) => {
    console.log(`Relaying ICE candidate from ${socket.id} to ${data.to}`);
    socket.to(data.to).emit("ice-candidate", {
      candidate: data.candidate,
      from: socket.id,
    });
  });

  socket.on("squat-count", (count) => {
    if (currentRoom) {
      socket.to(currentRoom).emit("squat-count", count);
    }
  });

  socket.on("challenge-started", (data) => {
    if (currentRoom) {
      socket.to(currentRoom).emit("challenge-started", data);
    }
  });

  socket.on("new-challenge", (data) => {
    if (currentRoom) {
      socket.to(currentRoom).emit("new-challenge", data);
    }
  });

  socket.on("declare-winner", (data) => {
    if (currentRoom) {
      io.to(currentRoom).emit("declare-winner", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (currentRoom && rooms.has(currentRoom)) {
      rooms.get(currentRoom).delete(socket.id);

      socket.to(currentRoom).emit("user-disconnected", socket.id);

      if (rooms.get(currentRoom).size === 0) {
        rooms.delete(currentRoom);
        console.log(`Room ${currentRoom} deleted`);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
