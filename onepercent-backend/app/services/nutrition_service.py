from datetime import datetime
from typing import Dict
from app.models.nutrition import NutritionPlan, SavePlanRequest
from app.services.firebase_nutrition_service import (
    get_user_details,
    save_nutrition_plan_to_firebase,
    get_current_nutrition_plan_from_firebase,
)
from app.utils.openai_handler import get_openai_nutrition_suggestions
from fastapi.responses import JSONResponse


class NutritionService:
    async def generate_plan(self, user_id: str) -> NutritionPlan:
        try:
            user_details: Dict = await get_user_details(user_id)

            # Step 2: Perform prompt engineering
            prompt = self._create_prompt(user_details)

            # Step 3: Call OpenAI API to get nutrition suggestions
            openai_response = await get_openai_nutrition_suggestions(prompt)

            # Step 4: Parse OpenAI response into NutritionPlan
            nutrition_plan = self._parse_openai_response(openai_response)

            return nutrition_plan
        except Exception as e:
            print(e)
            raise e  # This will be caught by the router and returned as a 500 error

    async def save_plan(self, user_id: str, plan: SavePlanRequest) -> None:
        try:
            await save_nutrition_plan_to_firebase(user_id, plan)
        except Exception as e:
            raise e  # This will be caught by the router and returned as a 500 error

    async def get_or_generate_plan(self, user_id: str) -> NutritionPlan:
        try:
            # Get the current date
            today = datetime.now().strftime("%Y-%m-%d")

            # Try to fetch the current meal plan from Firebase
            current_plan = await get_current_nutrition_plan_from_firebase(user_id, today)

            if current_plan:
                # If a plan exists for today, return it
                return JSONResponse(content=current_plan)

            # If no plan exists, generate a new one
            new_plan = await self.generate_plan(user_id)

            # Save the newly generated plan
            await self.save_plan(
                user_id,
                SavePlanRequest(date=today, meal_plan=new_plan.meal_plan),
            )

            # Return the newly generated plan
            return new_plan
        except Exception as e:
            raise e

    def _create_prompt(self, user_details: Dict) -> str:
        # Extract user details
        sport = user_details.get("sport", "general fitness")
        nutrition_preferences = user_details.get("nutrition_preferences", "balanced diet")
        allergies = user_details.get("allergies", [])

        # Create the prompt
        prompt = (
            f"Create a personalized nutrition plan for a user who is engaged in {sport}, "
            f"has the following nutrition preferences: {nutrition_preferences}, "
            f"and has the following allergies: {', '.join(allergies)}.\n"
            f"Provide the meal plan in JSON format as shown below:\n\n"
            "```\n"
            "{\n"
            '  "meal_plan": [\n'
            '    {\n'
            '      "meal": "Breakfast",\n'
            '      "items": ["🥞 Pancakes with syrup", "🍳 Scrambled eggs"],\n'
            '      "icon": "Coffee"\n'
            '    },\n'
            '    {\n'
            '      "meal": "Lunch",\n'
            '      "items": ["🍔 Veggie burger", "🥤 Smoothie"],\n'
            '      "icon": "Utensils"\n'
            '    }\n'
            '  ]\n'
            '}\n'
            "```\n"
            "Only provide the JSON code inside the triple backticks."
        )
        return prompt

    def _parse_openai_response(self, response: str) -> NutritionPlan:
        import re
        import json

        # Extract the JSON code block from the response
        json_match = re.search(r"```(?:json)?\s*(.*?)```", response, re.DOTALL)
        if not json_match:
            raise ValueError("Response does not contain a JSON code block.")

        json_str = json_match.group(1).strip()

        # Parse the JSON string
        try:
            nutrition_data = json.loads(json_str)
        except json.JSONDecodeError as e:
            raise ValueError(f"Error parsing JSON: {e}")

        # Extract the meal plan
        meal_plan_list = nutrition_data.get("meal_plan")
        if not meal_plan_list:
            raise ValueError("JSON does not contain 'meal_plan' key.")

        # Convert to NutritionPlan object
        nutrition_plan = NutritionPlan(meal_plan=meal_plan_list)
        return nutrition_plan
