import { request } from "../../fetchAPI";

export const getFilterApi = async ( token) => {
  try {
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    const response = await request(
      "/api/v1/profile/datingPreferences",
      "GET",
      headers
    );

    return response; // Return the response object

  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};
