from firebase_admin import auth, firestore
from app.models.user import UserProfile
from firebase_admin.exceptions import FirebaseError
from typing import Dict

class UserService:
    def __init__(self):
        self.db = firestore.client()
        self.users_collection = self.db.collection('users')
    
    def get_user_profile(self, uid: str) -> UserProfile:
        doc_ref = self.users_collection.document(uid)
        doc = doc_ref.get()

        if doc.exists:
            # Fetch all fields from the Firestore document
            user_data = doc.to_dict()
            return UserProfile(**user_data)
        
        # If the profile doesn't exist in Firestore, create a basic one
        try:
            user = auth.get_user(uid)
            profile = UserProfile(
                uid=uid,
                email=user.email,
                display_name=user.display_name,
                photo_url=user.photo_url
            )
            # Save the default profile to Firestore
            doc_ref.set(profile.dict(exclude_unset=True))
            return profile
        except Exception as e:
            # Handle errors (e.g., user not found in Firebase Auth)
            raise RuntimeError(f"Error fetching user profile: {e}")

    def update_user_profile(self, uid: str, profile_data: UserProfile) -> UserProfile:
        try:
            user_ref = self.users_collection.document(uid)

            # Convert UserProfile object to a dictionary if needed
            if isinstance(profile_data, UserProfile):
                profile_data = profile_data.dict(exclude_unset=True)

            user_ref.update(profile_data)

            # Retrieve the updated profile
            updated_doc = user_ref.get()
            if updated_doc.exists:
                updated_data = updated_doc.to_dict()
                return UserProfile(**updated_data)

            raise RuntimeError("Failed to retrieve updated profile.")
        except FirebaseError as e:
            raise RuntimeError(f"Firebase error: {e}")
        except Exception as e:
            raise RuntimeError(f"An unexpected error occurred: {e}")
