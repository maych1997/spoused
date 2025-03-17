import { request } from "../../fetchAPI";
export const paymentApi = async (type, description, amount, token, date) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/payment", "POST", options, {
      type,
      description,
      amount,
      date,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
