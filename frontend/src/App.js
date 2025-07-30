import './App.css';

import { Route, Routes, useLocation } from 'react-router-dom';

import NoPage from './pages/NoPage';
import RollDice from './pages/RollDice';
import Login from './pages/Login';
import Character from './pages/Character';

import Navbar from './components/Navbar';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route index element={<Login />} />
        <Route path="roll" element={<RollDice />} />
        <Route path="character" element={<Character />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  );
}

export default App;
