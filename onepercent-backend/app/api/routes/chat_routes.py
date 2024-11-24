import logging
from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth
from app.models.chat import ChatbotMode, Message
from app.services.chatbot_service import ChatbotService
from app.utils.jwt_handler import verify_jwt
from app.services.user_service import UserService
from fastapi import APIRouter, Depends, HTTPException, Query

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

chat_router = APIRouter()
chatbot_service = ChatbotService()
user_service = UserService()

@chat_router.post("/start")
async def start_chat(
    mode: ChatbotMode,
    token_data: dict = Depends(verify_jwt)
):
    """Start or resume a chat session"""
    logger.info("Received request to start chat session")
    try:
        logger.debug(f"Token data: {token_data}, Mode: {mode}")
        session = await chatbot_service.get_or_create_session(
            user_id=token_data['uid'],
            mode=mode
        )
        logger.info(f"Chat session created/resumed with ID: {session.session_id}")
        return {"session_id": session.session_id}
    except Exception as e:
        logger.error(f"Error starting chat session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.post("/message/{session_id}")
async def send_message(
    session_id: str,
    message: str = Query(...),  # Accept 'message' as a query parameter
    token_data: dict = Depends(verify_jwt)
):
    """Send message to chatbot"""
    try:
        # Get user profile from Firebase
        user_profile = user_service.get_user_profile(token_data['uid'])
        
        # Process message
        response = await chatbot_service.process_message(
            session_id=session_id,
            user_message=message,
            user_profile=user_profile
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))