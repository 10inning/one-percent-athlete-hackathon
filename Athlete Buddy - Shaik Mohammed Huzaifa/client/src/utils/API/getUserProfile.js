import axios from "axios"

export const getUserProfile = async (email, username = "") => {
    try{
        const data = await axios.post(
          "http://127.0.0.1:8000/AthleteBuddy/getAthlete",
          { email: email, username: username },
        );  
        return data.data
    }catch(error){
        console.log(error)
    }
}