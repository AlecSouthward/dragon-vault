import "./css/NoPage.css";

import { FaDice } from "react-icons/fa";

export default function NoPage() {
    return (
        <div className="no-page-container">
            <FaDice className="dice-icon" />

            <h1>404 - Page Not Found</h1>
        </div>
    );
}