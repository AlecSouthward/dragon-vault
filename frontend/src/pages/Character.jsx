import "./css/Character.css";

import PropTypes from "prop-types";
import { useState } from "react";

import { FaPlus, FaRegEye } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

const StatRow = ({ statName, statValue, canIncrease = false }) => (
    <div className="stat-row-container">
        <p className="stat-row-name">{statName}</p>
        
        <div className="stat-row-value-container">
            <p className="stat-row-value-number">{statValue}</p>
            {canIncrease &&
                <button className="stat-row-value-button">
                    <FaPlus />
                </button>
            }
        </div>
    </div>
);

const ItemRow = ({ itemName, itemSelected = false }) => (
    <div className={"item-row-container" + (itemSelected ? " selected" : "")}>
        <p className="item-row-name">{itemName}</p>
        {itemSelected ? <FaEye /> : <FaRegEye />}
    </div>
);

export default function Character({ userId }) {
    const [canIncreaseStats, setCanIncreaseStats] = useState(true);

    return (
        <div className="character-page-container">
            <h1>(character_name) SHEET</h1>
            <hr />

            <div className="stats-container">
                <h1>STATISTICS</h1>

                <StatRow statName="Strength" statValue={1} canIncrease={canIncreaseStats} />
                <StatRow statName="Dexterity" statValue={2} canIncrease={canIncreaseStats} />
                <StatRow statName="Charisma" statValue={3} canIncrease={canIncreaseStats} />
                <StatRow statName="Constitution" statValue={4} canIncrease={canIncreaseStats} />
                <StatRow statName="Intelligence" statValue={5} canIncrease={canIncreaseStats} />
            </div>

            <div className="items-container">
                <h1>ITEMS</h1>

                <div className="items-list-container">
                    <ItemRow itemName="Sword" itemSelected={true} />
                    <ItemRow itemName="Armor" />
                    <ItemRow itemName="Knife" />
                    <ItemRow itemName="Dagger" />
                    <ItemRow itemName="Artifact" />
                    <ItemRow itemName="Artifact" />
                    <ItemRow itemName="Artifact" />
                    <ItemRow itemName="Artifact" />
                    <ItemRow itemName="Artifact" />
                </div>
            </div>
        </div>
    );
}

Character.propTypes = {
    userId: PropTypes.string.isRequired
};

StatRow.propTypes = {
    statName: PropTypes.string.isRequired,
    statValue: PropTypes.number.isRequired,
    canIncrease: PropTypes.bool
};

ItemRow.propTypes = {
    itemName: PropTypes.string.isRequired
};