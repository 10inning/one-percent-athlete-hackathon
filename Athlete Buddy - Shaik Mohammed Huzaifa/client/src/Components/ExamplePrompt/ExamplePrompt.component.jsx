import { useState } from "react";
import { useDispatch } from "react-redux";
import { UpdatePrompt } from "../../store/prompt/prompt.reducer";
import { getChatResponse } from "../../utils/API/getChatResponse";
import "./ExamplePrompt.styles.scss";

export const ExamplePrompt = () => {
  const dispatch = useDispatch();

  async function handleSumbit(e) {
    const prompt = e.target.textContent;
    try {
      dispatch(
        UpdatePrompt({ type: "user", prompt: prompt }, "@update/prompt"),
      );
      console.log(prompt);
      const res = await getChatResponse(prompt);
      console.log(res);
      dispatch(UpdatePrompt({ type: "llm", prompt: res }));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="example-prompt-container">
      <h2>Example Prompts</h2>
      <div className="prompts">
        <p onClick={handleSumbit}>Find me some soccer professionals</p>
        <p onClick={handleSumbit}>
          My hamstring got strectched during bowling. Suggest me a pain reliever
        </p>
        <p onClick={handleSumbit}>I want a rugby trainer</p>
        <p onClick={handleSumbit}>Warmup exercise before javelin throw</p>
      </div>
    </div>
  );
};
