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
        socket.join(roomId);
        socket.to(roomId).emit('user:joined', { email, socketId: socket.id });
        io.to(socket.id).emit('room:joined', { email, roomId });
    });
    socket.on('user:call', ({offer, socketId }) => {
      io.to(socketId).emit('incomming:call', {from:socket.id , offer});
    });
    socket.on('call:accepted', ({to, answer}) => {
      io.to(to).emit('call:accepted', {from: socket.id, answer});
    });
    socket.on('peer:nego:needed', ({offer, to}) => {
      io.to(to).emit('peer:nego:needed', {offer, from: socket.id});
    });
    socket.on('peer:nego:done', ({to, answer}) => { 
      io.to(to).emit('peer:nego:final', {from: socket.id, answer});
    });
});


// io.on("connection", (socket) => {
//   console.log(`Socket Connected`, socket.id);
//   socket.on("room:join", (data) => {
//     const { email, room } = data;
//     emailToSocketMap.set(email, socket.id);
//     socketToEmailMap.set(socket.id, email);
//     io.to(room).emit("user:joined", { email, id: socket.id });
//     socket.join(room);
//     io.to(socket.id).emit("room:join", data);
//   });

//   socket.on("user:call", ({ to, offer }) => {
//     io.to(to).emit("incomming:call", { from: socket.id, offer });
//   });

//   socket.on("call:accepted", ({ to, ans }) => {
//     io.to(to).emit("call:accepted", { from: socket.id, ans });
//   });

//   socket.on("peer:nego:needed", ({ to, offer }) => {
//     console.log("peer:nego:needed", offer);
//     io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
//   });

//   socket.on("peer:nego:done", ({ to, ans }) => {
//     console.log("peer:nego:done", ans);
//     io.to(to).emit("peer:nego:final", { from: socket.id, ans });
//   });
// });

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});