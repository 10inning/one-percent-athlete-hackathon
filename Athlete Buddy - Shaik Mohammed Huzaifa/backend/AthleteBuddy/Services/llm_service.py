import os
from langchain_openai import OpenAI, ChatOpenAI
from dotenv import load_dotenv

load_dotenv()


class LLM:
    def __init__(self, token_limit, model):
        self.model = model or 'gpt-4o-mini'
        self.token_limit = token_limit

    def get_llm(self):
        # Return a ChatOpenAI instance configured with the specified parameters
        return ChatOpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            organization=os.getenv("OPENAI_ORGANISATION"),
            model_name=self.model,
            max_tokens=self.token_limit,
        )
