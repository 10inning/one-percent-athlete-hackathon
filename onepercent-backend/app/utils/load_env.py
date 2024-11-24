# load_env.py
import os
from dotenv import load_dotenv

def load_env_vars():
    """
    Loads environment variables from a .env file into the environment.
    """
    load_dotenv()  # Load variables from .env file

    # Check for required variables
    required_vars = ["OPENAI_API_KEY", "CREDS_PATH"]
    missing_vars = [var for var in required_vars if var not in os.environ]

    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

    # Optionally print or log confirmation
    print("Environment variables loaded successfully!")
