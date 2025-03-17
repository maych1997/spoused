import { request } from "../../fetchAPI";

export const boostNumberApi = async (token, count) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };

        // Sending the count in the request body
        const body = {
            count: count
        };

        const data = await request("/api/v1/profile/boostNumber", "PUT", options, body);

        return data;
    } catch (error) {
        throw error;
    }
};
