import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const deleteVideo = async (token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/deleteVideo", "POST", options);

    return data;
  } catch (error) {
    throw error;
  }
};
