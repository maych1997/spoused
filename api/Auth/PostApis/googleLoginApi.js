import { request } from "../../fetchAPI";

export const googleLoginApi = async (email, name, id, fcm, coordinates) => {
  try {
    const options = {
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/signInGoogle", "POST", options, {
      email,
      name,
      id,
      fcm,
      coordinates,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
