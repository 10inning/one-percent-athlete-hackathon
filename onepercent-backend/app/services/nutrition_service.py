from datetime import datetime
from app.models.nutrition import NutritionPlan
from app.services.firebase_nutrition_service import (
    get_user_details,
    get_plan_by_uuid_from_firebase,
    get_plan_by_date_from_firebase,
    create_plan_in_firebase_by_date,
    update_plan_in_firebase_by_date,
)
from app.utils.openai_handler import get_openai_nutrition_suggestions
from fastapi.responses import JSONResponse
from typing import Dict
from firebase_admin import credentials, firestore
from uuid import UUID, uuid4
from app.models.nutrition import NutritionPlan, MealItem  # Import MealItem
import pytz  # You'll need to install pytz
db = firestore.client()

class NutritionService:
    def get_plan_by_uuid(self, user_id: str, plan_uuid: UUID) -> NutritionPlan:
        """
        Retrieve a nutrition plan by its UUID.
        """
        try:
            # Attempt to fetch the plan by UUID from Firebase
            plan_data = get_plan_by_uuid_from_firebase(user_id, str(plan_uuid))
            if plan_data:
                # If the plan exists, return it as a NutritionPlan instance
                return NutritionPlan(**plan_data)
            else:
                # Generate a new plan if it doesn't exist
                new_plan = self.generate_plan(user_id)
                new_plan.uuid = uuid4()
                new_plan.date = datetime.utcnow()
                self.save_plan(user_id, new_plan)
                return new_plan
        except Exception as e:
            raise ValueError(f"Error in get_plan_by_uuid: {e}")

    def generate_plan(self, user_id: str) -> NutritionPlan:
        """
        Generate a new nutrition plan based on user details.
        """
        try:
            user_details = get_user_details(user_id)
            timezone_str = user_details.get('timezone', 'UTC')
            user_tz = pytz.timezone(timezone_str)

            # Create a prompt for OpenAI
            prompt = self._create_prompt(user_details)

            # Call OpenAI API to get nutrition suggestions
            openai_response = get_openai_nutrition_suggestions(prompt)

            # Parse OpenAI response into NutritionPlan
            nutrition_plan = self._parse_openai_response(openai_response)
            nutrition_plan.date = datetime.now(user_tz)
            nutrition_plan.uuid = uuid4()

            return nutrition_plan
        except Exception as e:
            raise ValueError(f"Error generating nutrition plan: {e}")

    def _create_prompt(self, user_details: Dict) -> str:
        # Extract user details with defaults
        sport = user_details.get("target_sport", "general fitness") or "general fitness"
        nutrition_preferences = user_details.get("diet_preference", "balanced diet") or "balanced diet"
        allergies = user_details.get("allergies") or []  # Default to empty list if None
        preferred_foods = user_details.get("preferred_foods") or []  # Default to empty list if None
        health_conditions = user_details.get("health_conditions") or []  # Default to empty list if None
        weight = user_details.get("weight") or 70.0  # Default to 70 kg if not provided
        height = user_details.get("height") or 175.0  # Default to 175 cm if not provided
        age = user_details.get("age", 30)  # Default to age 30
        location = user_details.get("location", "unknown location") or "unknown location"

        # Calculate calories using Harris-Benedict formula with activity adjustment
        bmr = 10 * weight + 6.25 * height - 5 * age + 5  # Basal Metabolic Rate (BMR) for males; subtract 161 for females
        sport_multipliers = {
            "basketball": 1.75,
            "running": 1.8,
            "swimming": 1.7,
            "cycling": 1.6,
            "yoga": 1.4,
            "general fitness": 1.5
        }
        activity_multiplier = sport_multipliers.get(sport.lower(), 1.5) if isinstance(sport, str) else 1.5
        calorie_requirement = int(bmr * activity_multiplier)

        # Prepare allergies and preferences in text
        allergy_text = ", ".join(allergies) if allergies else "no allergies"
        preferred_foods_text = ", ".join(preferred_foods) if preferred_foods else "no specific preferences"
        health_conditions_text = ", ".join(health_conditions) if health_conditions else "none"

        # Create the prompt
        prompt = (
            f"Create a personalized nutrition plan for a user engaged in {sport} from {location}, "
            f"who weighs {weight} kg and is {height} cm tall. "
            f"The user prefers a {nutrition_preferences} diet with the following food preferences: {preferred_foods_text}, "
            f"and has the following allergies: {allergy_text}. "
            f"They also have the following health conditions: {health_conditions_text}. "
            f"The user requires approximately {calorie_requirement} calories per day (not Strict).\n"
            f"The user only prefers to have not more than 4 meals a day"
            f"Provide the meal plan in JSON format as shown below:\n\n"
            "```\n"
            "{\n"
            '  "meal_plan": [\n'
            '    {\n'
            '      "meal": "Breakfast",\n'
            '      "items": ["🥞 Pancakes with syrup", "🍳 Scrambled eggs"],\n'
            '      "icon": "Coffee",\n'
            f'      "calories": 500\n'
            '    },\n'
            '    {\n'
            '      "meal": "Lunch",\n'
            '      "items": ["🍔 Veggie burger", "🥤 Smoothie"],\n'
            '      "icon": "Utensils",\n'
            f'      "calories": 600\n'
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

        # Extract the meal plan using 'meal_plan'
        meal_plan_list = nutrition_data.get("meal_plan")
        if not meal_plan_list:
            raise ValueError("JSON does not contain 'meal_plan' key.")

        # Convert to NutritionPlan object using MealItem
        meal_plan_objects = [MealItem(**meal) for meal in meal_plan_list]
        nutrition_plan = NutritionPlan(meal_plan=meal_plan_objects)
        return nutrition_plan  # Return the NutritionPlan object




    def save_plan(self, user_id: str, plan: NutritionPlan) -> NutritionPlan:
        """
        Save or update a nutrition plan in Firebase.
        """
        try:
            # Convert plan to dictionary format using aliases
            plan_dict = plan.to_dict()

            # Use user's timezone for date
            user_details = get_user_details(user_id)
            timezone_str = user_details.get('timezone', 'UTC')
            user_tz = pytz.timezone(timezone_str)
            date_str = plan.date.strftime('%Y-%m-%d')

            # Check if the plan already exists
            existing_plan = get_plan_by_date_from_firebase(user_id, date_str)

            if existing_plan:
                # Update existing plan
                update_plan_in_firebase_by_date(user_id, date_str, plan_dict)
            else:
                # Create new plan
                create_plan_in_firebase_by_date(user_id, date_str, plan_dict)

            return plan
        except Exception as e:
            raise ValueError(f"Error saving plan: {e}")

    def get_meal_plan_by_user(self, user_id: str) -> NutritionPlan:
        """
        Fetch the meal plan for today for the given user.
        """
        try:
            # Fetch user details to get timezone
            user_details = get_user_details(user_id)
            timezone_str = user_details.get('timezone', 'UTC')

            user_tz = pytz.timezone(timezone_str)
            today_user_tz = datetime.now(user_tz).strftime('%Y-%m-%d')

            plan_data = get_plan_by_date_from_firebase(user_id, today_user_tz)
            if plan_data:
                # Attempt to retrieve 'mealPlan' or fallback to 'meal_plan'
                meal_plan_key = 'mealPlan' if 'mealPlan' in plan_data else 'meal_plan'
                
                if meal_plan_key not in plan_data:
                    raise ValueError(f"Neither 'mealPlan' nor 'meal_plan' found in plan_data for user {user_id} on {today_user_tz}.")

                # Convert each meal in the meal plan to a MealItem object
                meal_plan_list = [MealItem(**meal) for meal in plan_data[meal_plan_key]]
                
                # Parse the date string to a datetime object
                plan_date = datetime.fromisoformat(plan_data['date']).replace(tzinfo=user_tz)
                
                nutrition_plan = NutritionPlan(
                    meal_plan=meal_plan_list,  # Use 'meal_plan' to match your NutritionPlan model
                    uuid=plan_data.get('uuid'),
                    date=plan_date
                )
                return nutrition_plan
            else:
                # Generate a new plan
                new_plan = self.generate_plan(user_id)
                new_plan.date = datetime.now(user_tz)
                new_plan.uuid = str(uuid4())  # Ensure UUID is a string
                self.save_plan(user_id, new_plan)
                return new_plan
        except Exception as e:
            raise ValueError(f"Error in get_meal_plan_by_user: {e}")

