import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import NoPage from './pages/NoPage';
import RollDice from './pages/RollDice';
import Login from './pages/Login';
import Character from './pages/Character';

import { USER_ID_STORAGE_KEY } from './constants';

function App() {
  const [userId, setUserId] = useState(undefined);

  const updateUserId = (newUserId, storeInLocalStorage = false) => {
    setUserId(newUserId);
    
    if (!storeInLocalStorage) return;
    localStorage.setItem(USER_ID_STORAGE_KEY, newUserId);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login updateUserId={updateUserId} />} />
        <Route path="dice" element={<RollDice userId={userId} />} />
        <Route path="character" element={<Character userId={userId} />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
