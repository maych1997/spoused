
export const request = async (
  url,
  method,
  headers = {},
  body = {},
  isNotStringified = false
) => {
  try {
    let res;
    let data;

    switch (
      method // Remove toUpperCase() here
    ) {
      case "GET":
        res = await fetch(process.env.EXPO_PUBLIC_BASE_URL + url, { headers });
        break;

      case "POST":
      case "PUT":
      case "PATCH":
        const requestOptions = {
          method,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: isNotStringified ? body : JSON.stringify(body),
        };
        console.log("this is the request options ");
        console.log(requestOptions);
        console.log(process.env.EXPO_PUBLIC_BASE_URL + url);
        console.log("this is the request options");
        res = await fetch(process.env.EXPO_PUBLIC_BASE_URL + url, requestOptions);
        break;

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    const text = await res.text(); // Get response text

    try {
      data = JSON.parse(text); // Attempt to parse response as JSON
      console.log('This is my response beta',data);

    } catch (err) {
      console.error("Failed to parse response as JSON:", text);
      throw new SyntaxError("Response is not valid JSON");
    }

    return data;
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};
