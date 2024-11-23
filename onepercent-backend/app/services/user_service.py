from firebase_admin import auth, firestore
from app.models.user import UserProfile, UserProfileUpdate

class UserService:
    def __init__(self):
        self.db = firestore.client()
        self.users_collection = self.db.collection('users')
    
    async def get_user_profile(self, uid: str) -> UserProfile:
        """Get user profile from Firestore"""
        doc_ref = self.users_collection.document(uid)
        doc = doc_ref.get()
        
        if doc.exists:
            user_data = doc.to_dict()
            return UserProfile(**user_data)
        
        # If profile doesn't exist, get basic info from Firebase Auth
        user = auth.get_user(uid)
        profile = UserProfile(
            uid=uid,
            email=user.email,
            display_name=user.display_name,
            photo_url=user.photo_url
        )
        # Create profile in Firestore
        doc_ref.set(profile.dict())
        return profile
    
    async def update_user_profile(self, uid: str, profile_update: UserProfileUpdate):
        """Update user profile in Firestore"""
        doc_ref = self.users_collection.document(uid)
        doc_ref.update(profile_update.dict(exclude_unset=True))
        return await self.get_user_profile(uid)