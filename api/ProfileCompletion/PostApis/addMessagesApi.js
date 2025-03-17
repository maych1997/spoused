import { request } from "../../fetchAPI";
export const addMessagesApi = async (
  type,
  chat,
  content,
  receiverId,
  token,
) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request(
      "/api/v1/profile/chat/message/add",
      "POST",
      options,
      {
        type,
        chat,
        content,
        receiverId
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log('There is error',error);
    throw error;
  }
};
