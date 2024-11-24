from pydantic import BaseModel, Field
from typing import Optional

class UserProfile(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = Field(None, example="John Doe")
    photo_url: Optional[str] = Field(None, example="https://example.com/photo.jpg")
    allergies: Optional[str] = Field(None, example="Peanuts, Shellfish")
    targetSport: Optional[str] = Field(None, example="Basketball")
    gamePlayed: Optional[str] = Field(None, example="3-on-3 Basketball")
    dietPreference: Optional[str] = Field(None, example="Vegan")
    preferredFoods: Optional[str] = Field(None, example="Grilled Chicken, Salad, Fruits")
    healthConditions: Optional[str] = Field(None, example="Asthma, Diabetes")
    location: Optional[str] = Field(None, example="New York, USA")
    weight: Optional[float] = Field(None, example=70.5)
    height: Optional[float] = Field(None, example=175.3)
