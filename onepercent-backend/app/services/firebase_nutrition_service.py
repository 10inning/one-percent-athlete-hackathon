import firebase_admin
from firebase_admin import credentials, firestore
from app.models.nutrition import NutritionPlan  # Adjust the import based on your models
from typing import Dict, Optional
from uuid import UUID
import os

db = firestore.client()

def get_user_details(user_id: str) -> Dict:
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

def get_plan_by_uuid_from_firebase(user_id: str, uuid_str: str) -> Optional[Dict]:
    """
    Fetch a nutrition plan by its UUID from Firebase.
    """
    try:
        plans_ref = db.collection('users').document(user_id).collection('nutrition_plans')
        plan_doc = plans_ref.document(uuid_str).get()
        if plan_doc.exists:
            return plan_doc.to_dict()
        return None
    except Exception as e:
        raise ValueError(f"Error fetching plan by UUID: {e}")

def create_plan_in_firebase_by_date(user_id: str, date_str: str, plan_data: Dict):
    """
    Create a new nutrition plan in Firebase under the date_str document ID.
    """
    try:
        doc_ref = db.collection('users').document(user_id).collection('nutrition_plans').document(date_str)
        doc_ref.set(plan_data)
    except Exception as e:
        raise ValueError(f"Error creating plan in Firebase: {e}")

def update_plan_in_firebase_by_date(user_id: str, date_str: str, plan_data: Dict):
    """
    Update an existing nutrition plan in Firebase under the date_str document ID.
    """
    try:
        doc_ref = db.collection('users').document(user_id).collection('nutrition_plans').document(date_str)
        doc_ref.update(plan_data)
    except Exception as e:
        raise ValueError(f"Error updating plan in Firebase: {e}")
def get_plan_by_date_from_firebase(user_id: str, date_str: str) -> Optional[Dict]:
    """
    Fetch a nutrition plan by date from Firebase.
    """
    try:
        plans_ref = db.collection('users').document(user_id).collection('nutrition_plans')
        plan_doc = plans_ref.document(date_str).get()
        if plan_doc.exists:
            return plan_doc.to_dict()
        return None
    except Exception as e:
        raise ValueError(f"Error fetching plan by date: {e}")
