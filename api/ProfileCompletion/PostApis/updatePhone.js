import { request } from "../../fetchAPI";
export const updatePhone = async (
  phoneCode,
  phoneNumber,
  token
) => {
  try {
    const options = {
      "Authorization":"Bearer "+token,  
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/updatePhone", "POST", options, {
      phoneCode,
      phoneNumber,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
