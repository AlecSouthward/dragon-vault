import "./css/Login.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";

import { FaDice } from "react-icons/fa";

import { retrieveAuthToken } from "../service/userService";

export default function Login() {
    const [username, setUsername] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();

    const handleUsernameChange = (evt) => {
        const newUsername = evt.target.value;

        setInputError(false);
        setErrorMessage(null);
        setUsername(newUsername);
    };

    const handlePasswordChange = (evt) => {
        const newPassword = evt.target.value;

        setInputError(false);
        setErrorMessage(null);
        setPassword(newPassword);
    };

    const handleLoginClick = async (evt) => {
        evt.preventDefault();

        setErrorMessage(null);

        if (!username || username.length === 0 || !password || password.length === 0) {
            setInputError(true);

            return;
        }

        setLoading(true);

        try {
            await retrieveAuthToken(username, password);
        } catch (err) {
            setErrorMessage(err.message);

            return;
        } finally {
            setLoading(false);
        }

        navigate("/dice");
    };

    return (
        <div className="login-page-container">
            <img alt="Website Icon" className="site-icon" src="/icon.png" />
            <h1 className="login-title">Login</h1>

            <form className="login-details-container" onSubmit={handleLoginClick}>
                <label id="username-label" htmlFor="username-input">Username:</label>
                <input
                    id="username-input"
                    disabled={loading}
                    alt="Username"
                    className={inputError ? "input-error" : undefined}
                    value={username}
                    onChange={handleUsernameChange}
                    type="text"
                />

                <label id="password-label" htmlFor="password-input">Password:</label>
                <input
                    id="password-input"
                    disabled={loading}
                    alt="password"
                    className={inputError ? "input-error" : undefined}
                    value={password}
                    onChange={handlePasswordChange}
                    type="password"
                />

                <button
                    id="login-button"
                    onClick={handleLoginClick}
                    disabled={loading}
                >{loading ? <FaDice /> : "Log In"}</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

Login.propTypes = {
    updateAuthToken: PropTypes.func.isRequired
};