from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth
from app.models.chat import ChatbotMode, Message
from app.services.chatbot_service import ChatbotService
from app.utils.jwt_handler import verify_jwt

chat_router = APIRouter()
chatbot_service = ChatbotService()

@chat_router.post("/start")
async def start_chat(
    mode: ChatbotMode,
    token_data: dict = Depends(verify_jwt)
):
    """Start or resume a chat session"""
    try:
        session = await chatbot_service.get_or_create_session(
            user_id=token_data['uid'],
            mode=mode
        )
        return {"session_id": session.session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.post("/message/{session_id}")
async def send_message(
    session_id: str,
    message: str,
    token_data: dict = Depends(verify_jwt)
):
    """Send message to chatbot"""
    try:
        # Get user profile from Firebase
        user_profile = await get_user_profile(token_data['uid'])
        print(user_profile)
        response = await chatbot_service.process_message(
            session_id=session_id,
            user_message=message,
            user_profile=user_profile
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))