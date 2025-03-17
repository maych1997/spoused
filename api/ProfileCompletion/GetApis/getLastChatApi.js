import { request } from "../../fetchAPI";
export const getLastChatApi = async (id, token) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            `/api/v1/profile/chat/conversationL/${id}`,
            "GET",
            options
        );

        return data;
    } catch (error) {
        throw error;
    }
};
