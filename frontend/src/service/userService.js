import { BACKEND_PATH } from "../constants";

export const sendLoginRequest = async (username) => {
    const response = await fetch(
        BACKEND_PATH + "/user/login",
        {
            method: "POST",
            body: JSON.stringify({ username }),
            headers: { 'Content-Type': 'application/json' }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to validate user");
    }

    const data = await response.json();
    
    return data;
};