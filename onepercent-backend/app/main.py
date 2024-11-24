import logging
import sys
from fastapi import FastAPI
import os
from app.utils.load_env import load_env_vars
from app.core.firebase_config import initialize_firebase

# Configure logging before any other imports
def setup_logging():
    # Disable all loggers first
    logging.getLogger().setLevel(logging.WARNING)
    
    # Configure basic logging
    logging.basicConfig(
        level=logging.WARNING,
        format="%(levelname)s: %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)]
    )
    
    # Suppress all known problematic loggers
    problematic_loggers = [
        "httpx",
        "httpx._config",
        "requests",
        "urllib3",
        "urllib3.connectionpool",
        "firebase_admin",
        "firebase_admin._token_gen",
        "cachecontrol",
        "cachecontrol.controller",
        "cachecontrol.adapter",
        "cachecontrol.filewrapper",
        "requests.adapters",
        "openai",
        "httpcore",
        "uvicorn",
        "sqlalchemy",
        "google.auth",
        "google.oauth2"
    ]
    
    for logger_name in problematic_loggers:
        logger = logging.getLogger(logger_name)
        logger.setLevel(logging.WARNING)
        logger.propagate = False
    
    # Configure loguru if it's being used
    try:
        from loguru import logger
        logger.remove()
        logger.add(
            sys.stderr,
            level="WARNING",
            format="{message}"
        )
    except ImportError:
        pass
    
    # Disable specific warnings
    import warnings
    warnings.filterwarnings("ignore", category=DeprecationWarning)
    warnings.filterwarnings("ignore", message="Valid config keys have changed in V2.*")

# Set up logging first
setup_logging()

# Now load environment variables and initialize Firebase
load_env_vars()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDS_PATH = os.getenv("CREDS_PATH")

# Initialize Firebase with logging suppressed
initialize_firebase()

# Import routes
from app.api.routes.api import router as router
from app.api.routes.user_routes import user_router
from app.api.routes.nutrition_routes import nutrition_router  
from app.api.routes.chat_routes import chat_router
from app.api.routes.ml_routes import ml_router
from app.core.events import create_start_app_handler
from app.core.config import API_PREFIX, DEBUG, PROJECT_NAME, VERSION

def get_application() -> FastAPI:
    application = FastAPI(
        title=PROJECT_NAME,
        debug=False,  # Set debug to False to reduce logging
        version=VERSION,
        # Disable docs in production
        openapi_url="/api/v1/openapi.json" if DEBUG else None,
        docs_url="/api/v1/docs" if DEBUG else None,
        redoc_url="/api/v1/redoc" if DEBUG else None,
    )

    
    # Include routers
    application.include_router(router, prefix=API_PREFIX)
    application.include_router(user_router)
    application.include_router(chat_router)
    application.include_router(nutrition_router)
    application.include_router(ml_router)

    pre_load = False
    if pre_load:
        application.add_event_handler("startup", create_start_app_handler(application))
    
    return application

# Create the application instance
app = get_application()

# Optional: Add middleware to suppress specific headers or response logging
@app.middleware("http")
async def suppress_logging_middleware(request, call_next):
    response = await call_next(request)
    return response

# Manually disable specific httpx logging
import httpx
httpx.Timeout._log_debug = lambda *args, **kwargs: None

# Additional logging configuration for urllib3
try:
    import urllib3
    urllib3.disable_warnings()
except ImportError:
    pass

# If you're using firebase-admin, configure its logging
try:
    import firebase_admin.credentials
    logging.getLogger('firebase_admin').setLevel(logging.WARNING)
except ImportError:
    pass

# If you're using requests, configure its logging
try:
    import requests
    requests.packages.urllib3.disable_warnings()
except ImportError:
    pass

# Configure cachecontrol logging
try:
    import cachecontrol
    logging.getLogger('cachecontrol').setLevel(logging.WARNING)
except ImportError:
    pass

# Final catch-all for any remaining debug logs
logging.getLogger().setLevel(logging.WARNING)