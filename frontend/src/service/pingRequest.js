import fetchApi from "./fetchApi";

const sendPingRequest = async () => {
    const response = await fetchApi({ path: "/ping" });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
    }
};

export default sendPingRequest;