import { request } from "../../fetchAPI";
export const getLastMessageSeen = async (id, token) => {
    try {
        const options = {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        };
        const data = await request(
            `/api/v1/profile/chat/conversationLastSeen/${id}`,
            "GET",
            options
        );

        return data;
    } catch (error) {
        throw error;
    }
};
