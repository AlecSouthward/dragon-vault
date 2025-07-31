import fetchApi from "./fetchApi";

export const sendLoginRequest = async (username, password) => {
    const response = await fetchApi({
        path: "/user/login",
        method: "POST",
        body: { username, password }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
};