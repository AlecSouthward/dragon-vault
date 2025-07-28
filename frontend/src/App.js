import './App.css';

import { Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';

import NoPage from './pages/NoPage';
import RollDice from './pages/RollDice';
import Login from './pages/Login';
import Character from './pages/Character';

import { USER_ID_STORAGE_KEY } from './constants';
import Navbar from './components/Navbar';

function App() {
  const [authToken, setAuthToken] = useState(undefined);

  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  const updateAuthToken = (newAuthToken) => {
    setAuthToken(newAuthToken);

    sessionStorage.setItem(USER_ID_STORAGE_KEY, newAuthToken);
  }

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route index element={<Login updateAuthToken={updateAuthToken} />} />
        <Route path="roll" element={<RollDice userId={authToken} />} />
        <Route path="character" element={<Character userId={authToken} />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  );
}

export default App;
