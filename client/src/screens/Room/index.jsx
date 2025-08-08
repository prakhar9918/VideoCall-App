import { useCallback, useEffect, useState } from "react";
import { useSocket } from '../../SocketProvider/index.jsx';
import peer from '../../services/peer.js'

const Room = () => {
  const socket = useSocket();
  const [remoteUsers, setRemoteUsers] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ email, socketId }) => {
    console.log(`User with email ${email} joined with socket ID ${socketId}`);
    setRemoteUsers(socketId);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    console.log("✅ Got stream: ", stream);
    setMyStream(stream);
    // const offer = await peer.createOffer(stream);
    // socket.emit('user:call', { offer, socketId: remoteUsers });
    // console.log(`Calling user with email ${remoteUsers}`);
  }, [remoteUsers, socket]);

  const handleIncommingCall = useCallback(async ({ from, offer }) => {
    console.log(`Incoming call from ${from}`);
    // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }, [socket]);

  useEffect(() => {
    socket.on('user:joined', handleUserJoined);
    socket.on('incomming:call', handleIncommingCall);
    return () => {
      socket.off('user:joined',handleUserJoined);
      socket.off('incomming:call', handleIncommingCall);
    };
  }, [socket, handleUserJoined]);

  return (
    <>
      <p>Room</p>
      <h4>{remoteUsers ? 'Connected' : 'No one in room'}</h4>
      {remoteUsers && <button onClick={handleCallUser}>CALL</button>}
      <br />
      {myStream && 
        <video
          ref={(video) => {
            if (video) video.srcObject = myStream;
          }}
          autoPlay
          muted
          width="400"
          height="200"
          controls
        />
      }
      <p>My Stream</p>
      {!myStream && <p>Waiting for stream...</p>}
    </>
  );
};

export default Room;
