import "./css/Navbar.css";

import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className="nav-menu-container">
            <div className="nav-menu">
                <NavLink to="/roll">Roll</NavLink>
                <NavLink to="/character">Character</NavLink>
            </div>
        </div>
    );
}