import { request } from "../../fetchAPI";
export const verificationCodeApi = async (email, token) => {
  try {
      const options = {
        "Content-Type": "application/json",
      };
    const data = await request("/api/v1/auth/verify-email", "POST", options, {
      email,
      token,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
