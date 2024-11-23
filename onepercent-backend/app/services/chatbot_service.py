from typing import Optional
import openai
from firebase_admin import firestore
from app.models.chat import ChatSession, Message, ChatbotMode, UserProfile
import datetime
class ChatbotService:
    def __init__(self):
        self.db = firestore.client()
        self.openai = openai
        
    async def get_or_create_session(
        self,
        user_id: str,
        mode: ChatbotMode
    ) -> ChatSession:
        """Get existing session or create new one"""
        # Check for existing active session
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
                Consider their dietary restrictions: {restrictions}
                Medical conditions: {conditions}
                Focus on providing personalized nutrition advice.""",
            
            ChatbotMode.FITNESS: """You are a fitness coach helping users achieve their fitness goals: {goals}
                Activity level: {activity_level}
                Consider any medical conditions: {conditions}
                Provide safe and personalized workout guidance."""
        }
        
        prompt = base_prompts.get(mode, "You are a helpful assistant.")
        return prompt.format(
            restrictions=", ".join(user_profile.dietary_restrictions),
            conditions=", ".join(user_profile.medical_conditions),
            goals=", ".join(user_profile.fitness_goals),
            activity_level=user_profile.activity_level
        )

    async def process_message(
        self,
        session_id: str,
        user_message: str,
        user_profile: UserProfile
    ) -> Message:
        """Process user message and return bot response"""
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
        response = await openai.ChatCompletion.acreate(
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
        session.last_updated = datetime.utcnow()
        
        # Save to Firebase
        session_ref.set(session.dict())
        
        return bot_msg