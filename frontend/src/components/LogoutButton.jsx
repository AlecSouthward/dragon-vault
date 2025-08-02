import "./css/LogoutButton.css";

import PropTypes from "prop-types";

import { TbLogout } from "react-icons/tb";

export default function LogoutButton({ clearLoginDetails }) {
    return (
        <button onClick={clearLoginDetails} type="button" title="Logout" className="logout-button">
            <TbLogout />
        </button>
    );
}

LogoutButton.propTypes = {
    clearLoginDetails: PropTypes.func.isRequired
};