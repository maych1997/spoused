import { request } from "../../fetchAPI";
export const resendCodeApi = async () => {
  try {
   
    const options = {
      
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/verifyEmailSend", "PUT", options);

    return data;
  } catch (error) {
    throw error;
  }
};
