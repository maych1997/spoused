import { request } from "../../fetchAPI";
export const GetNotificationsApi = async (
  token
) => {
  try {
    const options = {
      "Authorization":"Bearer "+token,  
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/myNotifications", "POST", options);
    return data;
  } catch (error) {
    throw error;
  }
};
