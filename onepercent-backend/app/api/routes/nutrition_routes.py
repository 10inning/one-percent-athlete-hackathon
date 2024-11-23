from fastapi import APIRouter, Depends, HTTPException
from app.models.nutrition import NutritionPlan, SavePlanRequest  # Adjust the import based on your models
from app.services.nutrition_service import NutritionService
from app.utils.jwt_handler import verify_jwt

nutrition_router = APIRouter()
nutrition_service = NutritionService()

@nutrition_router.post("/generate-meal-plan", response_model=NutritionPlan)
async def generate_nutrition_plan(
    token_data: dict = Depends(verify_jwt)
):
   
    try:
        nutrition_plan = await nutrition_service.generate_plan(
            user_id=token_data['uid']
        )
        print(nutrition_plan)
        return nutrition_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@nutrition_router.post("/save", response_model=dict)
async def save_nutrition_plan(
    plan: SavePlanRequest,
    token_data: dict = Depends(verify_jwt)
):

    try:
        await nutrition_service.save_plan(
            user_id=token_data['uid'],
            plan=plan
        )
        return {"message": "Nutrition plan saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
