import "./css/Dice.css";

import { useState } from "react";
import PropTypes from 'prop-types';

import { FaArrowsSpin } from "react-icons/fa6";

export default function Dice({ totalRoll = 20, rollType = "Dexterity", additions = [1, 3, 5] }) {
    const [roll, setRoll] = useState(undefined);

    const handleRoll = () => {
        let newRoll;

        do {
            newRoll = Math.ceil(Math.random() * totalRoll);
        } while (newRoll === roll);

        setRoll(newRoll);
    };

    return (
        <div className="dice-menu-container">
            <h1>Roll for {rollType}</h1>
            <hr className="title-separator"></hr>

            <div className="dice-container">
                <p
                    className={"roll-result" + ((roll === 20 || roll === 1) ? " important" : "")}
                >{roll}</p>
            </div>

            <button className="roll-button" type="button" onClick={handleRoll}>
                <FaArrowsSpin className="roll-icon" />
            </button>

            <div className="additions-container">
                <p>{roll}{additions.length > 0 && roll && "+"}</p>
                {additions.map((num, numIndex) => 
                    <p>{num}{(numIndex + 1 < additions.length) ? "+" : "="}</p>
                )}
                <p className="addition-result">
                    {roll ? roll + additions.reduce((total, num) => total + num) : "?"}
                </p>
            </div>
        </div>
    );
}

Dice.propTypes = {
    totalRoll: PropTypes.number,
    rollType: PropTypes.string,
    additions: PropTypes.arrayOf(PropTypes.number),
};