import { request } from "../../fetchAPI";
export const loginApi = async (email, password, coordinates, fcm) => {
  try {
    const options = {
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/login", "POST", options, {
      email: email,
      password: password,
      coordinates: coordinates,
      fcm: fcm,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
