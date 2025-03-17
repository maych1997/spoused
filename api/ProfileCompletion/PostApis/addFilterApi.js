import { request } from "../../fetchAPI";

export const addFilterApi = async (datingPreferences, id, token) => {
  try {
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    const requestBody = {
      id: id,
      datingPreferences: datingPreferences,
    };

    // Send the request using the custom request function
    const response = await request(
      "/api/v1/profile/datingPreferences",
      "PUT",
      headers,
      requestBody
    );

    return response; // Return the response object

    // Handle response here
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};
