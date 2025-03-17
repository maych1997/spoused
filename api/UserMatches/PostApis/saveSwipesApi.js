import { request } from "../../fetchAPI";
export const saveSwipesApi = async (swipedUserId, action, token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/swipe/saveswipes", "POST", options, {
      swipedUserId,
      action,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
