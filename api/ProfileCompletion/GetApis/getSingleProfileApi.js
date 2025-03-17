import { request } from "../../fetchAPI";
export const getSingleProfileApi = async (id,token) => {
  try {
    const options = {
      Authorization: "Bearer "+token,
      "Content-Type": "application/json"
    };
    const data = await request(
      `/api/v1/profile/${id}`,
      "GET",
      options
    );
    return data;
  } catch (error) {
    throw error;
  }
};
