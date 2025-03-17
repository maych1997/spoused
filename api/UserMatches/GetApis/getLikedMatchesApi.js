import { request } from "../../fetchAPI";
export const getLikedMatchesApi = async (token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,

      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/swipe/likes", "GET", options);

    return data;
  } catch (error) {
    throw error;
  }
};
