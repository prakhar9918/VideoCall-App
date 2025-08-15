import { useCallback, useEffect, useState } from "react";
import { useSocket } from '../../SocketProvider/index.jsx';
import peer from '../../services/peer.js';

const Room = () => {
  const socket = useSocket();
  const [remoteUsers, setRemoteUsers] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleUserJoined = useCallback(({ email, socketId }) => {
    console.log(`User with email ${email} joined with socket ID ${socketId}`);
    setRemoteUsers(socketId);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    console.log("Got stream: ", stream);
    setMyStream(stream);

    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream); // ✅ add tracks once here
    }

    const offer = await peer.getOffer();
    socket.emit('user:call', { offer, socketId: remoteUsers });
    console.log(`Calling user with id ${remoteUsers}`);
  }, [remoteUsers, socket]);

  const handleIncommingCall = useCallback(async ({ from, offer }) => {
    console.log(`Incoming call from ${from}`);
    setRemoteUsers(from);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMyStream(stream);

    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream); // ✅ add tracks on receiver side
    }

    await peer.peer.setRemoteDescription(offer);
    const answer = await peer.getAnswer(offer);
    socket.emit('call:accepted', { to: from, answer });
  }, [socket]);

  const handleCallAccepted = useCallback(async ({ from, answer }) => {
    console.log(`Call accepted by ${from}`);
    await peer.peer.setRemoteDescription(answer); // ✅ FIXED (was wrongly using setLocalDescription)
  }, []);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit('peer:nego:needed', { offer, to: remoteUsers });
  }, [remoteUsers, socket]);

  const handleNegoNeedIncomming = useCallback(async ({ offer, from }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit('peer:nego:done', { to: from, answer: ans });
  }, [socket]);

  const handleNegoNeedFinal = useCallback(async ({ answer, from }) => {
    await peer.peer.setRemoteDescription(answer); // ✅ FIXED
    console.log(`Negotiation done with ${from}`);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener('track', (event) => {
      const [stream] = event.streams;
      if (stream) {
        setRemoteStream(stream); // ✅ FIXED: use full MediaStream, not stream[0]
      }
    });
  }, []);

  useEffect(() => {
    socket.on('user:joined', handleUserJoined);
    socket.on('incomming:call', handleIncommingCall);
    socket.on('call:accepted', handleCallAccepted);
    socket.on('peer:nego:needed', handleNegoNeedIncomming);
    socket.on('peer:nego:final', handleNegoNeedFinal);
    return () => {
      socket.off('user:joined', handleUserJoined);
      socket.off('incomming:call', handleIncommingCall);
      socket.off('call:accepted', handleCallAccepted);
      socket.off('peer:nego:needed', handleNegoNeedIncomming);
      socket.off('peer:nego:final', handleNegoNeedFinal);
    };
  }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted, handleNegoNeedIncomming, handleNegoNeedFinal]);

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
      {remoteStream &&
        <video
          ref={(video) => {
            if (video) video.srcObject = remoteStream;
          }}
          autoPlay
          muted={false}
          width="400"
          height="200"
          controls
          style={{ border: '2px solid red' }}
        />
      }
      <p>Remote Stream</p>
    </>
  );
};

export default Room;
