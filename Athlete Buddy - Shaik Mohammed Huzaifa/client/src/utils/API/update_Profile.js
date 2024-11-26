import axios from "axios"

export const updateUserDetails = async (user_details) => {
    try {
      const data = await axios.post(
        "http://127.0.0.1:8000/AthleteBuddy/updateProfile",
        { athlete_details: user_details },
      );
      return data.data;
    } catch (error) {
      console.log(error);
    }
}