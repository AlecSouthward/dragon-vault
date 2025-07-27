import "./css/Login.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { FaDice } from "react-icons/fa";

import { USER_ID_STORAGE_KEY } from "../constants";
import { sendLoginRequest } from "../service/userService";

export default function Login({ updateUserId }) {
    const [username, setUsername] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

        if (!storedUserId) return;

        setLoading(true);

        updateUserId(storedUserId);
        navigate("/dice");
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUsernameChange = (evt) => {
        const newUsername = evt.target.value;

        setInputError(false);
        setErrorMessage(null);
        setUsername(newUsername);
    };

    const fetchUserData = async () => {
        setLoading(true);

        try {
            const loginResponse = await sendLoginRequest(username);
            await sendLoginRequest(username);
            await sendLoginRequest(username);
            await sendLoginRequest(username);
            await sendLoginRequest(username);
            await sendLoginRequest(username);
            await sendLoginRequest(username);
            await sendLoginRequest(username);
            await sendLoginRequest(username);
            await sendLoginRequest(username);

            return loginResponse.valid;
        } catch (err) {
            setErrorMessage(err.message);

            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = async () => {
        setErrorMessage(null);

        if (!username || username.length === 0) {
            setInputError(true);

            return;
        }

        const userData = await fetchUserData();

        if (!userData) {
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
                    id="username-input"
                    disabled={loading}
                    alt="Username"
                    className={inputError ? "username-error" : undefined}
                    value={username}
                    onChange={handleUsernameChange}
                    type="text"
                />

                <div className="remember-me-container">
                    <input
                        id="remember-me-toggle"
                        disabled={loading}
                        value={rememberMe}
                        onChange={(evt) => setRememberMe(evt.target.value)}
                        type="checkbox"
                    />

                    <label htmlFor="remember-me-toggle" className="remember-me-label">Remember Me</label>
                </div>

                <button
                    id="login-button"
                    onClick={handleLoginClick}
                    disabled={loading}
                >{loading ? <FaDice /> : "Log In"}</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
}

Login.propTypes = {
    updateUserId: PropTypes.func.isRequired
};