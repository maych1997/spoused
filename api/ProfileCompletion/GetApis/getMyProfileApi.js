import { request } from "../../fetchAPI";

export const getMyProfileApi = async (token, coordinates) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const payload = {
      coordinates, 
    };
    const data = await request(`/api/v1/profile/me`, "PATCH", options, payload);
    return data;
  } catch (error) {
    console.error("Error fetching and updating profile data:", error);
    throw error;
  }
};
