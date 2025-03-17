import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const unmatchUserApi = async (swipedUser, token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/swipe/unmatch", "POST", options, {
        swipedUser
    });

    return data;
  } catch (error) {
    throw error;
  }
};
