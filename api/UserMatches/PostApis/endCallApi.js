import { request } from "../../fetchAPI";
export const endCallApi = async (
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
      "/api/v1/profile/chat/endCall",
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
