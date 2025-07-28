import { BACKEND_PATH } from "../constants";

export const retrieveAuthToken = async (username, password) => {
    const response = await fetch(
        BACKEND_PATH + "/user/login",
        {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }
    
    return data.token;
};