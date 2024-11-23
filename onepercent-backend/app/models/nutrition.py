from pydantic import BaseModel
from typing import List, Optional


class Meal(BaseModel):
    meal: str
    items: List[str]
    icon: str

    def to_dict(self):
        return {
            'meal': self.meal,
            'items': self.items,
            'icon': self.icon
        }
class NutritionPlan(BaseModel):
    meal_plan: List[Meal]
    def to_dict(self):
        return {
            'mealPlan': [meal.to_dict() for meal in self.meal_plan]
        }


class SavePlanRequest(BaseModel):
    plan_id: Optional[str] = None
    nutrition_plan: Optional[NutritionPlan] = None
    created_at: Optional[str] = None  # ISO format datetime string
