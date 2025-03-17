import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";

export const updateGoldApi = async (token, goldMemberBadge) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/updateGold", "POST", options, {
      goldMemberBadge,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
