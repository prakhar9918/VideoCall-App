import React, {useCallback, useState ,useEffect} from 'react';
import { useSocket } from '../../SocketProvider/index.jsx';
import {useNavigate} from 'react-router-dom';

const LobbyScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');   
  const socket= useSocket();


  const handleSubmit = useCallback((e)=> {
    e.preventDefault();
    console.log(socket);
    socket.emit('room:join', { email, roomId });
    // console.log(`Joining room ${roomId} with email ${email}`);
  },[email, roomId, socket]);

  const handerRoomJoined = useCallback(({ email, roomId }) => {
    console.log(`Client --> Successfully joined room ${roomId} as ${email}`);
    navigate(`/room/${roomId}`);
  });

  useEffect(() => {
    socket.on('room:joined', handerRoomJoined);
    return () => {  
      socket.off('room:joined',handerRoomJoined); // Clean up the event listener when component unmounts
    }
  }, [socket,handerRoomJoined]);

  return (
    <div>  
        <h1>Lobby Screen</h1>
        <p>Welcome to the lobby!</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)}/>
          <br />
          <label htmlFor="room">RoomId:</label>
          <input type="number" id="room" name="room" required onChange={(e) => setRoomId(e.target.value)}/>
          <br />
          <button type="submit">Join Room</button>
        </form>
    </div>
  );
}       
export default LobbyScreen;