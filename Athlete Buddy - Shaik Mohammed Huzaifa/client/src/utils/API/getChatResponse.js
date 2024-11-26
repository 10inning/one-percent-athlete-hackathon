import axios from "axios";

const endpoint = "http://127.0.0.1:8000/AthleteBuddy/ask";

export const getChatResponse = async (query) => {
    try {
        // Making a POST request to the endpoint with the query and intent
        const res = await axios.post(endpoint, {
          prompt: query,
          Auth: "shaikmohdhuz@gmail.com",
        });

        // Return the response from the API
        return res.data;
    } catch (error) {
        // Log any error that occurs during the request
        console.error("Error fetching chat response:", error);
        throw error;  // Optionally, re-throw the error for further handling
    }
};
