# app/utils/test_token.py
import firebase_admin
from firebase_admin import auth
import time

def create_test_token(uid="test_user_123"):
    """
    Generate a test Firebase custom token for development
    """
    try:
        # Create a custom token
        custom_token = auth.create_custom_token(uid)
        
        return {
            "token": custom_token.decode('utf-8'),
            "uid": uid,
            "expires": time.time() + 3600  # 1 hour from now
        }
    except Exception as e:
        print(f"Error creating test token: {str(e)}")
        raise

def verify_test_token(token: str):
    """
    Verify a test token
    """
    try:
        # For testing, we'll just get the user from UID
        uid = auth.get_user(token).uid
        return {
            "uid": uid,
            "email": f"{uid}@test.com",  # Simulated email
            "iat": int(time.time()),
            "exp": int(time.time() + 3600)
        }
    except:
        return None