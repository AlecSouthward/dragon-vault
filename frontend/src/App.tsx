import { Route, Routes, useLocation } from 'react-router-dom';

import RoutePaths, { CampaignEditorRoutePaths } from './constants/RoutePaths';

import Navbar from './components/Navbar';
import CampaignEditorLayout from './layout/CampaignEditorLayout';

import About from './screens/About';
import Characters from './screens/CampaignEditor/Characters';
import Information from './screens/CampaignEditor/Information';
import CampaignList from './screens/CampaignList';
import Character from './screens/Character';
import Login from './screens/Login';
import NotFound from './screens/NotFound';
import PrivacyPolicy from './screens/PrivacyPolicy';
import RollDice from './screens/RollDice';

const App = (): React.JSX.Element => {
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col">
      {location.pathname !== RoutePaths.LOGIN && <Navbar />}

      <Routes>
        <Route index element={<Login />} />

        <Route path={RoutePaths.ABOUT} element={<About />} />
        <Route path={RoutePaths.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={RoutePaths.ROLL} element={<RollDice />} />
        <Route path={RoutePaths.CAMPAIGNS} element={<CampaignList />} />
        <Route path={RoutePaths.CHARACTER} element={<Character />} />

        <Route
          path={RoutePaths.CAMPAIGN_EDITOR}
          element={<CampaignEditorLayout />}
        >
          <Route
            path={CampaignEditorRoutePaths.INFORMATION}
            element={<Information />}
          />
          <Route
            path={CampaignEditorRoutePaths.CHARACTERS}
            element={<Characters />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
