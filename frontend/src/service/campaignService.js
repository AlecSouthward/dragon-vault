import fetchApi from "./fetchApi";

export const sendCreateCampaignRequest = async (name) => {
    const response = await fetchApi({
        path: "/campaign/create",
        method: "POST",
        body: { name }
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
    }
};

export const sendRetrieveCampaignsRequest = async (userId) => {
    const response = await fetchApi({
        path: `/campaign/retrieve-all-for-user/${userId}`
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data.campaigns;
};