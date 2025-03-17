import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const updateProfileSharingApi = async (token, profileSharing) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/updateProfileSharing", "POST", options, {
      profileSharing,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
