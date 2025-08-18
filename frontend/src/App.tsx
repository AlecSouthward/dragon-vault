import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/NavBar';

import Login from './screens/Login';
import NotFound from './screens/NotFound';

function App(): React.JSX.Element {
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col">
      {location.pathname !== '/' && <Navbar />}

      <Routes>
        <Route index element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
