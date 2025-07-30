import "./App.css";

import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import NoPage from "./pages/NoPage";
import RollDice from "./pages/RollDice";
import Login from "./pages/Login";
import Character from "./pages/Character";

import sendPingRequest from "./service/pingRequest";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(undefined);

  const hideNavbar = location.pathname === "/";

  useEffect(() => {
    sendPingRequest()
      .catch(() => navigate("/"));
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route index element={<Login setUser={setUser} />} />
        <Route path="roll" element={<RollDice />} />
        <Route path="character" element={<Character />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  );
}

export default App;
