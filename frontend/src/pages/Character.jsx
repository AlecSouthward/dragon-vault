import "./css/Character.css";

import PropTypes from "prop-types";
import { useState } from "react";

import { LuEye, LuEyeClosed } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";

import ITEMS from "../constants/Items";

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

const ItemRow = ({ itemName, handleClick, itemSelected = false }) => (
    <button className={"item-row-container" + (itemSelected ? " selected" : "")} onClick={handleClick}>
        <p className="item-row-name">{itemName}</p>
        {itemSelected ? <LuEye /> : <LuEyeClosed />}
    </button>
);

const CharacterWindow = ({ characterName, characterDescription }) => (
    <div className="character-window-container">
        <h1 className="character-window-title">{characterName}</h1>
        <p className="character-window-description">{characterDescription}</p>
    </div>
);

const ItemWindow = ({ itemName, itemDescription, hidden }) => (
    <div className={"item-window-container" + (hidden ? " hidden" : "")}>
        <h1 className="item-window-title">{itemName}</h1>
        <p className="item-window-description">{itemDescription}</p>
    </div>
);

export default function Character({ userId }) {
    const [canIncreaseStats, setCanIncreaseStats] = useState(true);
    const [selectedItem, setSelectedItem] = useState(undefined);

    return (
        <div className="character-page-container">
            <CharacterWindow />

            <div className="sheet-container">
                <h1>(character_name) Sheet</h1>
                <hr />

                <div className="stats-container">
                    <h1>Statistics</h1>

                    <StatRow statName="Strength" statValue={1} canIncrease={canIncreaseStats} />
                    <StatRow statName="Dexterity" statValue={2} canIncrease={canIncreaseStats} />
                    <StatRow statName="Charisma" statValue={3} canIncrease={canIncreaseStats} />
                    <StatRow statName="Constitution" statValue={4} canIncrease={canIncreaseStats} />
                    <StatRow statName="Intelligence" statValue={5} canIncrease={canIncreaseStats} />
                </div>

                <div className="items-container">
                    <h1>Items</h1>

                    <div className="items-list-container">
                        {Object.values(ITEMS).map((item) => (
                            <ItemRow
                                key={item.name}
                                itemName={item.name}
                                itemSelected={selectedItem === item}
                                handleClick={() => setSelectedItem(prev => {
                                    if (prev === item) return null;
                                    else return item;
                                })}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <ItemWindow
                itemName={selectedItem?.name}
                itemDescription={selectedItem?.description}
                hidden={!selectedItem}
            />
        </div>
    );
}

Character.propTypes = {
    userId: PropTypes.string.isRequired
};

CharacterWindow.propTypes = {
    characterName: PropTypes.string.isRequired,
    characterDescription: PropTypes.string
};

ItemWindow.propTypes = {
    itemName: PropTypes.string.isRequired,
    itemDescription: PropTypes.string,
    hidden: PropTypes.bool
}

StatRow.propTypes = {
    statName: PropTypes.string.isRequired,
    statValue: PropTypes.number.isRequired,
    canIncrease: PropTypes.bool
};

ItemRow.propTypes = {
    itemName: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    itemSelected: PropTypes.bool
};