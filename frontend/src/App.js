import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import NoPage from './pages/NoPage';
import RollDice from './pages/RollDice';
import Login from './pages/Login';
import Character from './pages/Character';

import { USER_ID_STORAGE_KEY } from './constants';

function App() {
  const [authToken, setAuthToken] = useState(undefined);

  const updateAuthToken = (newAuthToken) => {
    setAuthToken(newAuthToken);

    sessionStorage.setItem(USER_ID_STORAGE_KEY, newAuthToken);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login updateAuthToken={updateAuthToken} />} />
        <Route path="dice" element={<RollDice userId={authToken} />} />
        <Route path="character" element={<Character userId={authToken} />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
