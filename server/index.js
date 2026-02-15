// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// middleware
app.use(cors());

// initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // This is where Vite runs
    methods: ["GET", "POST"]
  }
});

// the "connection" event happens when a user opens the website
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 1. Listen for audio data from the client
  socket.on('audio-stream', (data) => {
    // "data" is a raw binary chunk of your voice
    console.log(`Received Audio Chunk: ${data.byteLength} bytes`);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});