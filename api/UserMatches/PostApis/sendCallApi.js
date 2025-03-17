import { request } from "../../fetchAPI";
export const sendCallApi = async (
  chat,
  meeting,
  token
) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request(
      "/api/v1/profile/chat/call",
      "POST",
      options,
      {
        chat,
        meeting,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
