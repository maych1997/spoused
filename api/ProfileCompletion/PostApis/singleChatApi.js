import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const singleChatApi = async (chatId, token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/swipe/singleChat", "POST", options, {
        chatId
    });

    return data;
  } catch (error) {
    throw error;
  }
};
