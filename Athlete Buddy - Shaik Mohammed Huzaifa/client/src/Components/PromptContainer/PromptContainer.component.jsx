import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { PromptSelector } from "../../store/prompt/prompt.selector.js";
import { Prompt } from "../Prompt/Prompt.component.jsx";
import "./PromptContainer.styles.scss"; // Correct style import
import { ExamplePrompt } from "../ExamplePrompt/ExamplePrompt.component.jsx";

export const PromptContainer = () => {
  const promptContainerRef = useRef(null);
  const prompts = useSelector(PromptSelector);

  useEffect(() => {
    // Scroll to the bottom of the container whenever prompts change
    if (promptContainerRef.current) {
      promptContainerRef.current.scrollTop =
        promptContainerRef.current.scrollHeight;
    }
  }, [prompts]);

  return (
    <div className="prompt-container" ref={promptContainerRef}>
      {prompts && prompts.length > 0 ? (
        prompts.map((prompt, index) => {
          const promptClass = index % 2 === 0 ? "user" : "llm";
          return <Prompt key={index} prompt={prompt} type={prompt.type} />;
        })
      ) : (
        <ExamplePrompt />
      )}
    </div>
  );
};
