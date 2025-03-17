import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const rematchUserApi = async (swipedUser, token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/swipe/rematch", "POST", options, {
        swipedUser
    });

    return data;
  } catch (error) {
    throw error;
  }
};
