import { PromptContainer } from "../PromptContainer/PromptContainer.component";
import PromptInput from "../Prompt Input/PromptInput.component";
import "./Chat.styles.scss";

export const Chat = () => {
  return (
    <div className="chat-container">
      <PromptContainer />
      <PromptInput />
    </div>
  );
};
