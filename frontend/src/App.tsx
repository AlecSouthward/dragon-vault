import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';

import Login from './screens/Login';
import NotFound from './screens/NotFound';
import RollDice from './screens/RollDice';

function App(): React.JSX.Element {
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col">
      {location.pathname !== '/' && <Navbar />}

      <Routes>
        <Route index element={<Login />} />
        <Route path="/roll" element={<RollDice />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
