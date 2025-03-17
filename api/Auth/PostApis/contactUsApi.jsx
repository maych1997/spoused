import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const contactUsApi = async (subject, message, token) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/contactUs", "POST", options, {
        subject,
        message
    });

    return data;
  } catch (error) {
    throw error;
  }
};
