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

export const sendLogOutRequest = async () => {
    const response = await fetchApi({
        path: "/user/logout",
        method: "POST"
    });

    if (!response.ok) {
        const data = await response.json();
        console.error(data.error);
    }
};

export const sendCreateUserRequest = async (username, password) => {
    const response = await fetchApi({
        path: "/user/create",
        method: "POST",
        body: { username, password }
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error);
    }
};

export const sendRetrieveAllUsersRequest = async () => {
    const response = await fetchApi({
        path: "/user/retrieve-all",
        method: "GET"
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data.users;
};