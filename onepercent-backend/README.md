# OnePercent Backend

A robust FastAPI-based backend service for the OnePercent application, providing APIs for fitness tracking, nutrition planning, and personalized coaching through AI-powered features.

## 🚀 Features

- User Profile Management
- Multi-mode Chatbot System (Nutrition, Fitness, General)
- AI-Powered Meal Planning
- Machine Learning Services
  - OpenPose Estimation for AI Fitness Tracking
  - Marathon Time Prediction
- Firebase Integration for Authentication and Storage
- JWT-based Security

## 🛠️ Technology Stack

- Python
- FastAPI
- Firebase (Authentication & Storage)
- Machine Learning Models
- Docker

## 📁 Project Structure

```
├── app/
│   ├── routers/         # API route definitions
│   ├── services/        # Business logic implementation
│   ├── models/          # Data models and schemas
│   └── certs/           # Firebase certificates
├── ml/
│   └── model/          # Machine learning model files
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## 🔧 Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/onepercent-backend.git
cd onepercent-backend
```

2. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

Required environment variables:
```env
# App Configuration

# OpenAI Configuration
OPENAI_API_KEY=your_openai_key

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin Configuration
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PROJECT_ID=your_project_id
CREDS_PATH=app/certs/your-firebase-adminsdk.json
```

3. Running with Docker

Using Docker Compose (recommended):
```bash
docker-compose up --build
```

Using Docker directly:
```bash
# Build the image
docker build -t onepercent-backend .

# Run with environment variables
docker run --env-file ./.env -p 8000:8000 onepercent-backend
```

## 🔒 Authentication

The API uses JWT token-based authentication in conjunction with Firebase. All protected endpoints require a valid Bearer token.

## 📚 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

Key endpoints include:
- `/profile` - User profile management
- `/start` - Initialize chatbot sessions
- `/generate-meal-plan` - AI-powered meal planning
- `/ml/marathon/predict` - Marathon time predictions

## 🚀 Deployment

For production deployment:
1. Ensure all environment variables are properly set in your deployment platform
2. Never commit .env files to version control
3. Use appropriate secrets management for production environments
4. Store Firebase credentials securely
5. Consider using container orchestration services like Kubernetes or AWS ECS

## ⚠️ Important Notes

- Keep your Firebase private key and OpenAI API key secure
- The `app/certs` directory should contain your Firebase admin SDK JSON file
- ML models should be placed in the `ml/model` directory
- Environment variables marked as `NEXT_PUBLIC` are for client-side Firebase configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

[MIT License](LICENSE)
