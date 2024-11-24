# app/utils/openai_handler.py
import os
from openai import OpenAI

client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")  # This is the default and can be omitted
)

def get_openai_nutrition_suggestions(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful nutritionist."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7,
        )
        # Extract the assistant's reply
        return response.choices[0].message.content
    except Exception as e:
        # Handle exceptions or re-raise
        raise e
