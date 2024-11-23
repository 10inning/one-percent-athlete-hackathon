from pydantic import BaseModel
from typing import Optional

class UserProfile(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    
class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    photo_url: Optional[str] = None