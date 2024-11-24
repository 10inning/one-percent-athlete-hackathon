from typing import Optional
from openai import OpenAI
from firebase_admin import firestore
from app.models.chat import ChatSession, Message, ChatbotMode
from app.models.user import UserProfile
import datetime
import os
class ChatbotService:
    def __init__(self):
        self.db = firestore.client()
        self.client = OpenAI(api_key = os.getenv("OPENAI_API_KEY")  
)


    async def get_or_create_session(
        self,
        user_id: str,
        mode: ChatbotMode
    ) -> ChatSession:
        """Get existing session or create new one"""
        sessions_ref = self.db.collection('chat_sessions')
        query = (sessions_ref
                 .where('user_id', '==', user_id)
                 .where('mode', '==', mode)
                 .order_by('last_updated', direction='DESCENDING')
                 .limit(1))
        
        docs = query.get()
        
        if docs and len(docs) > 0:
            return ChatSession(**docs[0].to_dict())
            
        # Create new session
        session = ChatSession(
            session_id=sessions_ref.document().id,
            user_id=user_id,
            mode=mode
        )
        sessions_ref.document(session.session_id).set(session.dict())
        return session

    def _get_system_prompt(self, mode: ChatbotMode, user_profile: UserProfile) -> str:
        """Generate system prompt based on mode and user profile"""
        base_prompts = {
            ChatbotMode.NUTRITION: """You are a nutrition expert helping users with their diet and meal planning.
                Dietary preference: {diet_preference}
                Allergies: {allergies}
                Health conditions: {health_conditions}
                Preferred foods: {preferred_foods}
                Location: {location}
                Weight: {weight} kg, Height: {height} cm
                Provide tailored nutrition advice.""",
            
            ChatbotMode.FITNESS: """You are a fitness coach helping users achieve their fitness goals.
                Target sport: {target_sport}
                Game played: {game_played}
                Allergies: {allergies}
                Health conditions: {health_conditions}
                Weight: {weight} kg, Height: {height} cm
                Location: {location}
                Provide personalized and safe workout guidance."""
        }
        
        prompt = base_prompts.get(mode, "You are a helpful assistant.")
        return prompt.format(
            diet_preference=user_profile.diet_preference or "None",
            allergies=user_profile.allergies or "None",
            health_conditions=user_profile.health_conditions or "None",
            preferred_foods=user_profile.preferred_foods or "None",
            location=user_profile.location or "Unknown",
            weight=user_profile.weight or "Unknown",
            height=user_profile.height or "Unknown",
            target_sport=user_profile.target_sport or "None",
            game_played=user_profile.game_played or "None"
        )

    async def process_message(self,session_id: str,user_message: str,user_profile: UserProfile) -> ChatSession:
        """Process user message and return updated session with LLM response"""
        # Get session
        session_ref = self.db.collection('chat_sessions').document(session_id)
        session_data = session_ref.get()
        if not session_data.exists:
            raise ValueError("Session not found")
            
        session = ChatSession(**session_data.to_dict())
        
        # Prepare messages for OpenAI
        messages = [
            {"role": "system", "content": self._get_system_prompt(session.mode, user_profile)}
        ]
        
        # Add context from previous messages (last 5)
        for msg in session.messages[-5:]:
            messages.append({"role": msg.role, "content": msg.content})
            
        # Add new user message
        messages.append({"role": "user", "content": user_message})
        
        # Get OpenAI response
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        # Create and save messages
        user_msg = Message(role="user", content=user_message)
        bot_msg = Message(
            role="assistant",
            content=response.choices[0].message.content
        )
        
        # Update session
        session.messages.extend([user_msg, bot_msg])
        session.last_updated = datetime.datetime.utcnow()
        
        # Save to Firebase
        session_ref.set(session.dict())
        
        # Return the updated session with all messages
        return session
