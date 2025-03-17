const { randomInt } = require('crypto');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Saving index file location
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Once connected, send message of user connecting / disconnecting / messages
io.on('connection', (socket) => {
  // Log when a user connects
  console.log('a user connected');

  // Set default nickname
  socket.nickname = 'Anonymous' + randomInt(1000).toString();

  
  // Receive nickname from client
  socket.on('set nickname', (nickname) => {
    socket.nickname = nickname;
    console.log(`${nickname} has joined`);
    io.emit('chat message', `${nickname} has joined the chat`);
  });

  // Add "user" typing functionality
  socket.on('typing', () => {
    socket.broadcast.emit('typing', `${socket.nickname} is typing...`);
  });

  // Receive chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${socket.nickname}: ${msg}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`${socket.nickname} disconnected`);
    io.emit('chat message', `${socket.nickname} has left the chat`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});