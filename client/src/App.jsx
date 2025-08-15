import './App.css'
import { Route, Routes} from 'react-router-dom';
import LobbyScreen from './screens/lobbyScreen';
import RoomPage from './screens/Room';


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LobbyScreen/>} />
      <Route path="/room/:roomId" element={<RoomPage/>} />
    </Routes>
    </>
  )
}

export default App
