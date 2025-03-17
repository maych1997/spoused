import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const swapPhotos = async (token, index) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/swapPhotos", "POST", options, {
      index,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
