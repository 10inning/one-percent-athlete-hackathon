# app/utils/firebase_handler.py

import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict
import os

db = firestore.client()

async def get_user_details(user_id: str) -> Dict:
    """
    Fetch user details from the 'users' collection in Firebase.
    """
    try:
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists:
            raise ValueError(f"User with ID {user_id} not found.")
        return user_doc.to_dict()
    except Exception as e:
        raise ValueError(f"Error fetching user details: {e}")


async def save_nutrition_plan_to_firebase(user_id: str, plan: Dict) -> None:
    """
    Save the nutrition plan for the given user in the 'nutrition_plans' sub-collection.
    """
    try:
        date = plan.get("date")
        if not date:
            raise ValueError("Date is required to save the nutrition plan.")

        db.collection('users').document(user_id).collection('nutrition_plans').document(date).set(plan)
    except Exception as e:
        raise ValueError(f"Error saving nutrition plan: {e}")


async def get_current_nutrition_plan_from_firebase(user_id: str, date: str) -> Dict:
    """
    Fetch the current day's nutrition plan for the user.
    """
    try:
        plan_doc = (
            db.collection('users')
            .document(user_id)
            .collection('nutrition_plans')
            .document(date)
            .get()
        )
        if plan_doc.exists:
            return plan_doc.to_dict()
        return None  # Return None if no plan exists for the date
    except Exception as e:
        raise ValueError(f"Error fetching current nutrition plan: {e}")
