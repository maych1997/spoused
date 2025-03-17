import { request } from "../../fetchAPI";
export const getAllChatsApi = async (token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request(
      "/api/v1/profile/chat/all-chats",
      "GET",
      options
    );
    return data;
  } catch (error) {
    throw error;
  }
};
