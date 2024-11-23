# config/firebase_config.py
import firebase_admin
from firebase_admin import credentials, auth

def initialize_firebase(cred_path: str):
    """Initialize Firebase Admin SDK"""
    cred = credentials.Certificate(cred_path)
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