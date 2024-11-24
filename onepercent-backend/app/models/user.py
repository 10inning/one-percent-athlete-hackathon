from pydantic import BaseModel, Field
from typing import Optional

class UserProfile(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = Field(None, example="John Doe")
    photo_url: Optional[str] = Field(None, example="https://example.com/photo.jpg")
    allergies: Optional[str] = Field(None, example="Peanuts, Shellfish")
    target_sport: Optional[str] = Field(None, example="Basketball")
    game_played: Optional[str] = Field(None, example="3-on-3 Basketball")
    diet_preference: Optional[str] = Field(None, example="Vegan")
    preferred_foods: Optional[str] = Field(None, example="Grilled Chicken, Salad, Fruits")
    health_conditions: Optional[str] = Field(None, example="Asthma, Diabetes")
    location: Optional[str] = Field(None, example="New York, USA")
    weight: Optional[float] = Field(None, example=70.5)
    height: Optional[float] = Field(None, example=175.3)
