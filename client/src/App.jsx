import './App.css'
import { Route, Routes} from 'react-router-dom';
import LobbyScreen from './screens/lobbyScreen';
import RoomPage from './screens/Room';
import Signup from './screens/Signup';
import Login from './screens/Login';
import RequireAuth from './screens/RequireAuth';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<RequireAuth><LobbyScreen/></RequireAuth>} />
      <Route path="/room/:roomId" element={<RequireAuth><RoomPage/></RequireAuth>} />
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>} />
    </Routes>
    </>
  )
}

export default App
