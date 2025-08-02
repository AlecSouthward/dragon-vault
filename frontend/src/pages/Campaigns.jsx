import "./css/Campaigns.css";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { sendRetrieveCampaignsRequest } from "../service/campaignService";

import CreateCampaignMenu from "../components/CreateCampaignMenu";
import { useNavigate } from "react-router-dom";

export default function Campaigns({ currentCampaign, setCampaign }) {
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateCampaignMenu, setShowCreateCampaignMenu] = useState(false);

    useEffect(() => {
        setLoading(true);

        sendRetrieveCampaignsRequest()
            .then((res) => {
                setCampaigns(res);

                if (!currentCampaign) {
                    return;
                }
                
                navigate("/campaign");
            })
            .finally(() => setLoading(false));
    }, [showCreateCampaignMenu]);

    const handleCampaignEnterClick = (campaign) => {
        navigate("/character");
        
        setCampaign(campaign);
    };

    const renderCampaignItem = (campaign) => {
        const isCurrentCampaign = campaign.id === currentCampaign?.id;

        return (
            <div key={campaign.id} className={`campaign-item ${isCurrentCampaign ? "current-campaign" : ""}`}>
                <p className="campaign-name">{campaign.name}</p>
                {
                    isCurrentCampaign ?
                    <p className="selected-campaign-message">Current</p> :
                    <button onClick={() => handleCampaignEnterClick(campaign)}>Enter</button>
                }
            </div>
        );
    };

    return (
        <div className="campaigns-menu-container">
            <div className="campaigns-menu">
                <h1>Campaigns</h1>
                <hr />
                
                <div className="campaigns-list">
                    {loading && <h3 className="loading">Loading...</h3>}
                    {!loading && campaigns.length === 0 && <h3 className="none-found">No Campaigns found</h3>}
                    {!loading && campaigns.length > 0 && campaigns.map(renderCampaignItem)}
                </div>
            </div>
            
            <button
                type="button"
                className="create-campaign-button"
                onClick={() => setShowCreateCampaignMenu(prev => !prev)}
            >Create Campaign</button>
            
            {showCreateCampaignMenu && <CreateCampaignMenu hideMenu={() => setShowCreateCampaignMenu(false)} />}
        </div>
    );
}

Campaigns.propTypes = {
    currentCampaign: PropTypes.object.isRequired,
    setCampaign: PropTypes.func.isRequired
};