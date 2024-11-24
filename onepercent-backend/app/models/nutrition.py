from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class MealItem(BaseModel):
    meal: str
    items: List[str]
    icon: str
    calories: int

class NutritionPlan(BaseModel):
    meal_plan: List[MealItem]
    date: datetime = None
    uuid: str = None

    def to_dict(self):
        return {
            "meal_plan": [item.dict() for item in self.meal_plan],
            "date": self.date.isoformat() if self.date else None,
            "uuid": self.uuid,
        }
