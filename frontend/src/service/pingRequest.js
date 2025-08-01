import fetchApi from "./fetchApi";

const sendPingRequest = async () => {
    const response = await fetchApi({ path: "/ping" });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data.user;
};

export default sendPingRequest;