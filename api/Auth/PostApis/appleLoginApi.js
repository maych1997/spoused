import { request } from "../../fetchAPI";

export const appleLoginApi = async (
  email,
  fullName,
  user,
  fcm,
  coordinates
) => {
  try {
    const options = {
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/apple", "POST", options, {
      email,
      fullName,
      user,
      fcm,
      coordinates,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
