import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import NoPage from "./pages/NoPage";
import RollDice from "./pages/RollDice";
import Login from "./pages/Login";
import Character from "./pages/Character";
import Admin from "./pages/Admin";
import Campaigns from "./pages/Campaigns";
import LogoutButton from "./components/LogoutButton";

import sendPingRequest from "./service/pingRequest";
import useSessionState from "./utils/useSessionStorage";
import { sendLogOutRequest } from "./service/userService";

import { CAMPAIGN_KEY, USER_KEY } from "./constants";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useSessionState(USER_KEY, null);
  const [campaign, setCampaign] = useSessionState(CAMPAIGN_KEY, null);

  const hideNavbar = location.pathname === "/";

  useEffect(() => {
    sendPingRequest()
      .then(res => setUser(res))
      .catch(() => navigate("/"));
  }, []);

  const clearLoginDetails = async () => {
    navigate("/");

    setUser(null);
    setCampaign(null);
    await sendLogOutRequest();
  };

  return (
    <>
      {!hideNavbar && (
        <div className="top-menu-container">
          <Navbar user={user} campaign={campaign} />
          <LogoutButton clearLoginDetails={clearLoginDetails} />
        </div>
      )}

      <Routes>
        <Route index element={<Login setUser={setUser} />} />
        {user?.isAdmin && <Route path="admin" element={<Admin />} />}
        <Route path="campaigns" element={<Campaigns currentCampaign={campaign} setCampaign={setCampaign} currentUser={user} />} />
        <Route path="roll" element={<RollDice />} />
        <Route path="character" element={<Character />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  );
}

export default App;
