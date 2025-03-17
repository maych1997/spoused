export const updateVideoApi = async (video, token) => {
  try {
    const files = new FormData();

    files.append("video", {
      name: new Date().getTime() + "_video",
      type: video.mimeType,
      uri: video.uri,
    });

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
      process.env.EXPO_PUBLIC_BASE_URL + "/api/v1/profile/uploadVideo",
      requestOptions
    );

    const text = await res.text(); 

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
