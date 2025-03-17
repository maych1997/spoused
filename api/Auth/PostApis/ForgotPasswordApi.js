import { request } from "../../fetchAPI";
export const forgotPasswordApi = async (email) => {
  try {
    const options = {
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/forgotPassword", "POST", options, {
      email,
    });
    return data; 
  } catch (error) {
    throw error; 
  }
};
