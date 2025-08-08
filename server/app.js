const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});


app.use(cors());
app.use(express.json());

const emailToSocketMap = new Map();
const socketToEmailMap = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    });
    socket.on('room:join', ({ email, roomId }) => {
        console.log(`Server --> User with email ${email} joined room ${roomId}`);
        emailToSocketMap.set(email, socket.id);
        socketToEmailMap.set(socket.id, email);
        io.to(roomId).emit('user:joined', { email, socketId: socket.id });
        socket.join(roomId);
        io.to(socket.id).emit('room:joined', { email, roomId });
    });
    socket.on('user:call', ({offer, socketId }) => {
      io.to(socketId).emit('incomming:call', {from:socket.id , offer});
    });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});