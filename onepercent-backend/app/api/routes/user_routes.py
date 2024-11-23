from fastapi import APIRouter, Depends
from app.models.user import UserProfile, UserProfileUpdate
from app.services.user_service import UserService
from app.utils.jwt_handler import verify_jwt
from app.utils.test_token import create_test_token

user_router = APIRouter()
user_service = UserService()

@user_router.get("/profile", response_model=UserProfile)
async def get_profile(token_data: dict = Depends(verify_jwt)):
    uid = token_data['uid']
    return await user_service.get_user_profile(uid)

@user_router.put("/profile", response_model=UserProfile)
async def update_profile(
    profile_update: UserProfileUpdate,
    token_data: dict = Depends(verify_jwt)
):
    uid = token_data['uid']
    return await user_service.update_user_profile(uid, profile_update)

