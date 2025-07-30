import { BACKEND_PATH } from "../constants";

const fetchApi = ({ path, method = "GET", body = undefined }) => (
    fetch(
        BACKEND_PATH + path,
        {
            method,
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        }
    )
);

export default fetchApi;