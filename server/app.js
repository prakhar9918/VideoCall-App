const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const  connectDB  = require('./db');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: ["http://localhost:3000","https://video-call-app-flame-two.vercel.app/"],
        methods: ["GET", "POST"],
        credentials: true, // Allow credentials to be sent
    }
});


app.use(cors({
  origin: ["http://localhost:3000","https://video-call-app-flame-two.vercel.app/"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/userRoute'));

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





server.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');

});


