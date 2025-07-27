import "./css/Login.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { USER_ID_STORAGE_KEY } from "../constants";

export default function Login({ updateUserId }) {
    const [username, setUsername] = useState(undefined);
    const [rememberMe, setRememberMe] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [error, setError] = useState(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

        if (!storedUserId) return;

        updateUserId(storedUserId);
        navigate("/dice");
    }, []);

    const handleUsernameChange = (evt) => {
        const newUsername = evt.target.value;

        setInputError(false);
        setError(null);
        setUsername(newUsername);
    };

    const fetchUserData = () => {
        return true; // send API request to backend
    };

    const handleLoginClick = () => {
        if (!username || username.length === 0) {
            setInputError(true);

            return;
        }

        const userData = fetchUserData();

        if (!userData) {
            setError("An error occurred while fetching data");

            return;
        }

        updateUserId(userData, rememberMe);
        navigate("/dice");
    };

    return (
        <div className="login-page-container">
            <img alt="Website Icon" className="site-icon" src="/icon.png" />
            <h1 className="login-title">Login</h1>

            <div className="login-details-container">
                <label id="username-label" htmlFor="username-input">Username:</label>
                <input
                    type="text"
                    id="username-input"
                    alt="Username"
                    className={inputError && "username-error"}
                    value={username}
                    onChange={handleUsernameChange}
                />

                <div className="remember-me-container">
                    <input
                        id="remember-me-toggle"
                        value={rememberMe}
                        onChange={(evt) => setRememberMe(evt.target.value)}
                        type="checkbox"
                    />

                    <label htmlFor="remember-me-toggle" className="remember-me-label">Remember Me</label>
                </div>

                <button id="login-button" onClick={handleLoginClick}>Log In</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

Login.propTypes = {
    updateUserId: PropTypes.func.isRequired
};