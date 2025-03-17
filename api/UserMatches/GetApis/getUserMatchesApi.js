import { request } from "../../fetchAPI";
export const getUserMatchesApi = async (token) => {
  console.log("is it even in here ? ");
  try {
    const options = {
      Authorization: "Bearer " + token,

      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/auth/usermatches", "GET", options);
    
    return data;
  } catch (error) {
    throw error;
  }
};
