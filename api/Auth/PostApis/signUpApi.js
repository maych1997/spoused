import { request } from "../../fetchAPI";


export const signUpApi = async (state) => {
  try {
    const options = {
      "Content-Type": "application/json",
    };
    console.log("this is the state ")
    console.log(state);
    console.log("this is the state");
    // Make the API call using the request function
    const data = await request("/api/v1/auth/register", "POST", options, state);
    return data; // Return the response data
  } catch (error) {
    throw error; // Rethrow the error to be handled by the caller
  }
};
