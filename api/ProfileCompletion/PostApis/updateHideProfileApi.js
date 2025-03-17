import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const updateHideProfileApi = async (token, hideProfile) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request(
      "/api/v1/profile/updateHideProfile",
      "POST",
      options,
      {
        hideProfile,
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};
