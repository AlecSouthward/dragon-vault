import "./css/CreateCampaignMenu.css";

import { useState } from "react";
import PropTypes from "prop-types";

import { sendCreateCampaignRequest } from "../../service/campaignService";

export default function CreateCampaignMenu({ hideMenu }) {
    const [name, setName] = useState(undefined);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendCreateRequest = async () => {
        if (!name) {
            setError(true);

            return;
        }

        setLoading(true);

        await sendCreateCampaignRequest(name);

        setLoading(false);
        hideMenu();
    };

    const handleNameChange = ({ target }) => {
        setError(false);

        const newName = target.value;
        const regex = new RegExp(/[^A-Za-z\s]/g);

        if (regex.test(newName)) return;

        setName(target.value);
    };

    return (
        <div className="create-campaign-container">
            <div className="create-campaign-menu">
                <h1>Create Campaign</h1>
                <hr />

                <label htmlFor="campaign-name-input">Name</label>
                <input
                    id="campaign-name-input"
                    className={error && "error"}
                    value={name}
                    aria-autocomplete="none"
                    onChange={handleNameChange}
                    disabled={loading}
                />

                <div className="campaign-buttons-container">
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

CreateCampaignMenu.propTypes = {
    hideMenu: PropTypes.func.isRequired
};