import { request } from "../../fetchAPI";
export const travelModeApi = async (
  token,
  toggle,
  city,
  locationCoordinates,
) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request(
      "/api/v1/profile/updateTravelMode",
      "PUT",
      options,
      {
        toggle,
        city,
        locationCoordinates,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
