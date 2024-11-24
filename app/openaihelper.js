import axios from "axios";
import { db } from "../app/firebase"; // Ensure correct path to your Firebase config
import { doc, getDoc } from "firebase/firestore";

export const getAIResponse = async (userId, userMessage) => {
  const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // Fetch data from a specific collection
  const fetchCollectionData = async (collection, userId) => {
    try {
      const docRef = doc(db, collection, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : {};
    } catch (error) {
      console.error(`Error fetching data from ${collection}:`, error);
      return {};
    }
  };

  // Fetch data from `metrics` and `chat_context`
  const [ metricsData, chatContextData] = await Promise.all([
    fetchCollectionData("metrics", userId),
    fetchCollectionData("chat_context", userId),
  ]);

  // Combine all data into a single context
  const combinedContext = {
    ...metricsData,
    ...chatContextData,
  };

  // Dynamically construct the context message
  const fields = [
    { label: "Sport", key: "Sport" },
    { label: "Grade", key: "Grade" },
    { label: "Position", key: "Position" },
    { label: "Body Weight", key: "Body Weight" },
    { label: "Training Phase", key: "Training Phase" },
    { label: "Season Phase", key: "Season Phase" },
    { label: "Power Score", key: "Power Score" },
    { label: "Jump Score", key: "Jump Score" },
    { label: "Speed Score", key: "Speed Score" },
    { label: "Relative Strength Score", key: "Relative Strength Score" },
    { label: "Estimated 40 Yard Dash", key: "Estimated 40 Yard Dash" },
    { label: "Total Sessions", key: "Total Sessions" },
    { label: "Sessions Attended", key: "Sessions Attended" },
    { label: "Attendance Score", key: "Attendance Score" },
  ];

  const contextDetails = fields
    .map(({ label, key }) =>
      combinedContext[key] ? `- **${label}**: ${combinedContext[key]}` : `- **${label}**: unknown`
    )
    .join("\n");

  const contextMessage = `
    You are a fitness coach. The user is focused on the sport ${combinedContext.Sport || "unknown sport"}.
    Here are their fitness details:
    ${contextDetails}

    Provide advice tailored to their fitness and sport requirements.
  `;

  const url = "https://api.openai.com/v1/chat/completions";
  console.log(combinedContext,contextMessage)
  try {
    
    const response = await axios.post(
      url,
      {
        model: "gpt-3.5-turbo", // Use a cost-effective model
        messages: [
          { role: "system", content: contextMessage }, // Include context as the first message
          { role: "user", content: userMessage }, // Include the user's query
        ],
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw new Error("Failed to fetch AI response.");
  }
};
