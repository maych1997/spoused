import { request } from "../../fetchAPI";
export const resetPasswordApi = async (resettoken) => {
  try {
    const options = {
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/resetPassword", "POST", options, {
      resettoken,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
