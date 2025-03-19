import { request } from "../../fetchAPI";
export const addMessagesApi = async (
  type,
  chat,
  content,
  receiverId,
  token,
  senderId,
  appId,
  userDetails,
  channelName,
) => {
  console.log('Data::::::::::::::::::::::::::', {
    type: type,
    chat: chat,
    content: content,
    receiverId: receiverId,
    token: token,
    senderId: senderId,
    appId:appId,
    userDetails:userDetails,
    channelName:channelName,
  });
  
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
        receiverId,
        token,
        senderId,
        appId,
        userDetails,
        channelName,
      }
    );
    console.log('This is my Data:::::::::::::::::::::::',data);
    return data;
  } catch (error) {
    console.log('There is error',error);
    throw error;
  }
};
