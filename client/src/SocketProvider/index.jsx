import { createContext,useContext } from "react";
import { io } from "socket.io-client";
import { useMemo } from "react";
const SocketContext = createContext();

const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};

const SocketProvider = ({ children}) => {
   const socket = useMemo(() => io('https://videocall-app-575a.onrender.com'), []); 
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketProvider, useSocket };

export default SocketContext;
