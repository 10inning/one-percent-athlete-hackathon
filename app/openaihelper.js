import axios from "axios";

export const getAIResponse = async (athleteData, message) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const url = "https://api.openai.com/v1/chat/completions";
  
    // Use system and user roles for better structure
    const messages = [
      {
        role: "system",
        content: `
          You are a fitness coach specialized in ${athleteData.sport}.
          The athlete is ${athleteData.age} years old, with a fitness level of ${athleteData.fitnessLevel}.
          Your responses should be clear, concise, and actionable, tailored to the athlete's sport and fitness level.
        `,
      },
      {
        role: "user",
        content: message,
      },
    ];
  
    try {
      const response = await axios.post(
        url,
        {
          model: "gpt-3.5-turbo", // Adjust to "gpt-4" if needed and within budget
          messages: messages,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
  
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      throw new Error("Failed to fetch AI response");
    }
  };
  