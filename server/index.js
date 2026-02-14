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

  // listeners for events (we will add more later)
  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});