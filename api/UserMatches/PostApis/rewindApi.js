import { request } from "../../fetchAPI";
export const rewindApi = async (token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/swipe/rewind", "POST", options);
    return data;
  } catch (error) {
    throw error;
  }
};
