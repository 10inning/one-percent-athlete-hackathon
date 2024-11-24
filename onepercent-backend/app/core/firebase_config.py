# config/firebase_config.py
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

# Load environment variables from .env file
load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK using environment variables"""
    # Get Firebase configuration from environment variables
    firebase_private_key = os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n")
    firebase_client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    firebase_project_id = os.getenv("FIREBASE_PROJECT_ID")
    
    # Create credentials dictionary
    cred_dict = {
        "type": "service_account",
        "project_id": firebase_project_id,
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": firebase_private_key,
        "client_email": firebase_client_email,
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
    }

    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)


# utils/jwt_handler.py
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth

security = HTTPBearer()

async def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}"
        )