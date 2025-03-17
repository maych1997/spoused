import { validName } from "../../../src/utility/validations";
import { request } from "../../fetchAPI";
export const onBoardingApi = async (
  profession,
  ethnicGroup,
  education,
  location,
  maritalStatus,
  height,
  datingPreferences,
  smoking,
  children,
  lookingFor,
  religion,
  drink,
  starSign,
  interests,
  personalityTraits,
  biography,
  
  token
) => {
  try {
    const options = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const data = await request("/api/v1/profile/onboarding", "POST", options, {
      profession,
      ethnicGroup,
      education,
      location,
      maritalStatus,
      height,
      datingPreferences,
      smoking,
      children,
      lookingFor,
      religion,
      drink,
      starSign,
      interests,
      personalityTraits,
      biography ,
      locationCoordinates: {
        type: "Point",
        coordinates:[51.5074, 0.1278],
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
