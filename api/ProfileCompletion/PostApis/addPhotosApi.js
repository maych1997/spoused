import { request } from "../../fetchAPI";

export const addPhotosApi = async (photo,index, token) => {
  try {
    const files = new FormData();

    files.append("photos", {
      name: new Date().getTime() + "_photos",
      type: photo.mimeType,
      uri: photo.uri,
    });

    files.append("index", index);

    const requestOptions = {
      method: "POST",
      body: files,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    res = await fetch(
      process.env.EXPO_PUBLIC_BASE_URL + "/api/v1/profile/uploadPhotos",
      requestOptions
    );

    const text = await res.text(); // Get response text

    try {
      data = JSON.parse(text); // Attempt to parse response as JSON
    } catch (err) {
      console.error("Failed to parse response as JSON:", text);
      throw new SyntaxError("Response is not valid JSON");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
