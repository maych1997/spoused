import { request } from "../../fetchAPI";
export const generalInfoApi = async (
  fullName,
  birthday,
  gender,
  phoneCode,
  phoneNumber,
  token
) => {
  try {
    const options = {
      "Authorization":"Bearer "+token,  
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/generalinfo", "POST", options, {
      fullName,
      birthday,
      gender, 
      phoneCode,
      phoneNumber,
      phoneNumberVerified:"true"
    });
    return data;
  } catch (error) {
    throw error;
  }
};
