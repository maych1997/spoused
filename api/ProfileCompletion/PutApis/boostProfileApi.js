import { request } from "../../fetchAPI";
export const boostProfileApi = async (
  token
) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/boost", "PUT", options);

    return data;
  } catch (error) {
    throw error;
  }
};
