from pydantic import BaseModel
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime

class ChatbotMode(str, Enum):
    NUTRITION = "nutrition"
    FITNESS = "fitness"
    GENERAL = "general"

class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = datetime.utcnow()
    metadata: Optional[Dict] = None

class ChatSession(BaseModel):
    session_id: str
    user_id: str
    mode: ChatbotMode
    messages: List[Message] = []
    created_at: datetime = datetime.utcnow()
    last_updated: datetime = datetime.utcnow()
    context: Dict = {}  # Stores user profile, preferences, etc.

class UserProfile(BaseModel):
    user_id: str
    fitness_goals: List[str] = []
    dietary_restrictions: List[str] = []
    activity_level: str
    weight: Optional[float]
    height: Optional[float]
    age: Optional[int]
    medical_conditions: List[str] = []