export const updateAudioApi = async (intro, token) => {
  try {

     const uriParts = intro.split('.');
    const fileType = uriParts[uriParts.length - 1];
    const files = new FormData();
    files.append('intro', {
      uri: intro,
      name: new Date().getTime() + "intro",
      type: `audio/${fileType}`,
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
      process.env.EXPO_PUBLIC_BASE_URL + "/api/v1/profile/uploadIntro",
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
