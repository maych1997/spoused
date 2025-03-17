import { request } from "../../fetchAPI";
export const getFiltersApi = async (token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request(
      '/api/v1/profile/datingPreferences',
      "GET",
      options
    );
    return data;
  } catch (error) {
    throw error;
  }
};
