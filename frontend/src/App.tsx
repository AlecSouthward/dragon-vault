import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Campaign } from './types/dto';

import Navbar from './components/Navbar';

import CampaignList from './screens/CampaignList';
import Login from './screens/Login';
import NotFound from './screens/NotFound';
import RollDice from './screens/RollDice';

const App = (): React.JSX.Element => {
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col">
      {location.pathname !== '/' && <Navbar />}

      <Routes>
        <Route index element={<Login />} />
        <Route path="/roll" element={<RollDice />} />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
