import { Route, Routes, useLocation } from 'react-router-dom';

import RoutePaths from './constants/RoutePaths';

import Navbar from './components/Navbar';

import CampaignList from './screens/CampaignList';
import Character from './screens/Character';
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
        <Route path={RoutePaths.ROLL} element={<RollDice />} />
        <Route path={RoutePaths.CAMPAIGNS} element={<CampaignList />} />
        <Route path={RoutePaths.CHARACTER} element={<Character />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
