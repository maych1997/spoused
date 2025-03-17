import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const updateNotificationApi = async (token, notifications, fcm) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/updateNotification", "POST", options, {
      notifications,
      fcm
    });

    return data;
  } catch (error) {
    throw error;
  }
};
