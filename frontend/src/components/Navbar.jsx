import "./css/Navbar.css";

import PropTypes from "prop-types";

import { NavLink } from 'react-router-dom';

export default function Navbar({ user, campaign }) {
    return (
        <div className="nav-menu-container">
            <div className="nav-menu">
                {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
                <NavLink to="/campaigns">Campaigns</NavLink>
                {campaign && <NavLink to="/roll">Roll</NavLink>}
                {campaign && <NavLink to="/character">Character</NavLink>}
            </div>
        </div>
    );
}

Navbar.propTypes = {
    user: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired
};