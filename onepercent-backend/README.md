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
app/
├── routers/         # API route definitions
├── services/        # Business logic implementation
├── models/          # Data models and schemas
└── ml/
    └── models/      # Machine learning model inference
```

## 🔧 Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/onepercent-backend.git
cd onepercent-backend
```

2. Create and configure `.env` file
```env
FIREBASE_CONFIG=your_config
OPENAI_API_KEY=your_key
# Add other required environment variables
```

3. Build and run with Docker
```bash
docker build -t onepercent-backend .
docker run -p 8000:8000 onepercent-backend
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

[MIT License](LICENSE)
