const serverless = require('serverless-http');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
  }
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('joinRoom', (roomID) => {
    console.log(`User ${socket.id} joined room ${roomID}`);
    socket.join(roomID);
  });
  socket.on('chat', ({ text, roomID }) => {
    console.log(`User ${socket.id} sent a chat message to room ${roomID}: ${text}`);
    io.to(roomID).emit('chat', text);
  });
  socket.on('play', (roomID) => {
    console.log(`User ${socket.id} played video in room ${roomID}`);
    io.to(roomID).emit('play');
  });
  socket.on('pause', (roomID) => {
    console.log(`User ${socket.id} paused video in room ${roomID}`);
    io.to(roomID).emit('pause');
  });
  socket.on('sync', ({ timestamp, roomID }) => {
    console.log(`User ${socket.id} synced video in room ${roomID} to timestamp ${timestamp}`);
    io.to(roomID).emit('sync', { timestamp, roomID });
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports.handler = serverless(http);
