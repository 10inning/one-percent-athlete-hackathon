from fastapi import APIRouter, Depends, HTTPException
from app.models.nutrition import NutritionPlan
from app.services.nutrition_service import NutritionService
from app.services.firebase_nutrition_service import get_user_details
from app.utils.jwt_handler import verify_jwt
from typing import Dict
from uuid import uuid4
from datetime import datetime
import pytz

nutrition_router = APIRouter()
nutrition_service = NutritionService()

@nutrition_router.get("/get-meal-plan")
def get_meal_plan(
    token_data: dict = Depends(verify_jwt)
):
    try:
        nutrition_plan = nutrition_service.get_meal_plan_by_user(
            user_id=token_data['uid'],
        )
        return nutrition_plan.to_dict()  # Return dictionary for UI compatibility
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@nutrition_router.post("/generate-meal-plan")
def generate_nutrition_plan(
    token_data: dict = Depends(verify_jwt)
):
    try:
        user_id = token_data['uid']
        user_details = get_user_details(user_id)
        timezone_str = user_details.get('timezone', 'UTC')
        user_tz = pytz.timezone(timezone_str)

        # Generate a new plan
        nutrition_plan = nutrition_service.generate_plan(user_id=user_id)
        nutrition_plan.date = datetime.now(user_tz)
        nutrition_plan.uuid = str(uuid4())

        # Save the plan, overwriting today's plan if it exists
        saved_plan = nutrition_service.save_plan(
            user_id=user_id,
            plan=nutrition_plan
        )
        # print(saved_plan)
        return saved_plan.to_dict()  # Return dictionary for UI compatibility
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@nutrition_router.post("/save-meal-plan")
def save_meal_plan(
    nutrition_plan: NutritionPlan,
    token_data: Dict = Depends(verify_jwt)
):
    try:
        user_id = token_data['uid']
        user_details = get_user_details(user_id)
        timezone_str = user_details.get('timezone', 'UTC')
        user_tz = pytz.timezone(timezone_str)

        # Ensure date is set to today in user's timezone
        nutrition_plan.date = datetime.now(user_tz)
        # Generate a new UUID
        nutrition_plan.uuid = str(uuid4())

        saved_plan = nutrition_service.save_plan(
            user_id=user_id,
            plan=nutrition_plan
        )

        return saved_plan.to_dict()  # Return dictionary for UI compatibility
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
