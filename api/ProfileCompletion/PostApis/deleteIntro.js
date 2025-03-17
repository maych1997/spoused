import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const deleteIntro = async (token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/deleteIntro", "POST", options);

    return data;
  } catch (error) {
    throw error;
  }
};
