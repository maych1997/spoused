import { request } from "../../fetchAPI";
export const newPasswordApi = async (resettoken, password) => {
  try {
    const options = {
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/newPassword", "POST", options, {
      resettoken,
      password,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
