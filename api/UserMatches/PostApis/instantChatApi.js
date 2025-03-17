import { request } from "../../fetchAPI";


export const instantChatApi = async (swipedUserId, token) => {
  console.log('this is the swiped user id');
  console.log(swipedUserId);
  console.log('this is the swiped user id');
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/chat/instantchat", "POST", options, {
        swipedUserId,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
