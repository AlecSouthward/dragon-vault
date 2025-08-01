import "./css/CreateUserMenu.css";

import { useState } from "react";
import PropTypes from "prop-types";

import { sendCreateUserRequest } from "../service/userService";

export default function CreateUserMenu({ hideMenu }) {
    const [name, setName] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const handleSendCreateRequest = async () => {
        if (!name || !password) {
            setInputError(true);

            return;
        }

        setLoading(true);

        try {
            await sendCreateUserRequest(name, password);
        } catch (err) {
            console.log(err);
            setErrorMessage(err.message);

            return;
        } finally {
            setLoading(false);
        }

        hideMenu();
    };

    const handleUsernameChange = ({ target }) => {
        const newName = target.value;
        const regex = new RegExp(/[^A-Za-z\s]/g);

        if (regex.test(newName)) return;

        setInputError(false);
        setErrorMessage(null);

        setName(target.value);
    };

    const handlePasswordChange = ({ target }) => {
        const newPassword = target.value;
        const regex = new RegExp(/[^A-Za-z\s]/g);

        if (regex.test(newPassword)) return;

        setInputError(false);
        setErrorMessage(null);

        setPassword(target.value);
    };

    return (
        <div className="create-user-container">
            <div className="create-user-menu">
                <h1>Create User</h1>
                <hr />

                <label htmlFor="username-input">Username</label>
                <input
                    id="username-input"
                    type="text"
                    className={inputError && "error"}
                    value={name}
                    aria-autocomplete="none"
                    onChange={handleUsernameChange}
                    disabled={loading}
                />

                <label htmlFor="password-input">Password</label>
                <input
                    id="password-input"
                    type="password"
                    className={inputError && "error"}
                    value={password}
                    aria-autocomplete="none"
                    onChange={handlePasswordChange}
                    disabled={loading}
                />

                {errorMessage && <p className="error">{errorMessage}</p>}

                <div className="user-buttons-container">
                    <button
                        type="submit"
                        onClick={handleSendCreateRequest}
                        disabled={loading}
                    >Create</button>
                    
                    <button
                        type="button"
                        onClick={hideMenu}
                        disabled={loading}
                    >Cancel</button>
                </div>
            </div>
        </div>
    );
}

CreateUserMenu.propTypes = {
    hideMenu: PropTypes.func.isRequired
};