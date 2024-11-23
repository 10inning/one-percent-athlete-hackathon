from fastapi import FastAPI
import os
from app.utils.load_env import load_env_vars
from app.core.firebase_config import initialize_firebase

load_env_vars()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDS_PATH = os.getenv("CREDS_PATH")
initialize_firebase(CREDS_PATH)

from app.api.routes.api import router as router
from app.api.routes.user_routes import user_router
from app.api.routes.nutrition_routes import nutrition_router  

from app.api.routes.chat_routes import chat_router
from app.core.events import create_start_app_handler
from app.core.config import API_PREFIX, DEBUG, PROJECT_NAME, VERSION


def get_application() -> FastAPI:
    application = FastAPI(title=PROJECT_NAME, debug=DEBUG, version=VERSION)
    application.include_router(router, prefix=API_PREFIX)
    application.include_router(user_router)
    application.include_router(chat_router)
    application.include_router(nutrition_router)
    pre_load = False
    if pre_load:
        application.add_event_handler("startup", create_start_app_handler(application))
    return application


app = get_application()

