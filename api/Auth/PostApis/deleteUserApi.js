import { request } from "../../fetchAPI";

export const deleteUserApi = async (token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/deleteAccount", "POST", options);
    return data;
  } catch (error) {
    throw error;
  }
};
