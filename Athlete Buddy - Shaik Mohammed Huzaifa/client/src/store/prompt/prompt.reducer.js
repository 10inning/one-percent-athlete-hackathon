const PromptActionTypes = {
  UPDATE_PROMPT: "@update/prompt",
};

const Inital_state = {
  prompt: [],
};

export const UpdatePrompt = (payload) => {
  return {
    payload: payload,
    type: PromptActionTypes.UPDATE_PROMPT,
  };
};

export const promptReducer = (state = Inital_state, action) => {
  const { type, payload } = action;

  if (type == PromptActionTypes.UPDATE_PROMPT) {
    return {
      prompt: [...state.prompt, payload],
    };
  }

  return state;
};
