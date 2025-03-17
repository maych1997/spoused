export const verifyUserApi = async (image1, image2, token) => {
  try {

    const fileName1 = image1.uri.split("/").pop();
    const fileType1 = fileName1.split(".").pop();
    const fileName2 = image2.uri.split("/").pop();
    const fileType2 = fileName2.split(".").pop();

    
    const files = new FormData();

    files.append("files", {
      uri: `data:${fileType1};base64,${image1.base64}`,
      name: fileName1,
      type: `image/${fileType1}`,
    });

    files.append("files", {
      uri: `data:${fileType2};base64,${image2.base64}`,
      name: fileName2,
      type: `image/${fileType2}`,
    });

    console.log("files", files);

    console.log(process.env.EXPO_PUBLIC_BASE_URL);
    
    

    const requestOptions = {
      method: "POST",
      body: files,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },  
    };
    res = await fetch(
      process.env.EXPO_PUBLIC_BASE_URL + "/api/v1/profile/compare-faces",
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
