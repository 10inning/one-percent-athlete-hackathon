# One Percent Athlete 🏃‍♂️

An AI-powered fitness platform that helps athletes optimize their performance through personalized meal planning, workout analysis, and intelligent coaching. Built with Next.js frontend and FastAPI backend.

## Project Overview 🌟

One Percent Athlete is a comprehensive fitness platform that leverages artificial intelligence to provide personalized fitness solutions. The project combines advanced ML models with intuitive user interfaces to deliver a seamless fitness experience.

## Team 👥

**Solo Developer**: Hoyath
- Full Stack Development
- ML Model Implementation
- UI/UX Design
- DevOps & Deployment


<p float="left">
  <img src="https://github.com/user-attachments/assets/632dcb64-eddd-4829-9bcb-87e350f6fa94" width="600" />
  <img src="https://github.com/user-attachments/assets/453733ce-e829-41d7-915e-051cdf1fda1d" width="600" />
  <img src="https://github.com/user-attachments/assets/f46425fb-7652-4918-b0c1-cdffd7bbafed" width="600" />
  <img src="https://github.com/user-attachments/assets/4092a635-37d2-4d63-82c3-bd9a429362b3" width="600" />
  <img src="https://github.com/user-attachments/assets/b55731ee-d3c8-47bc-97cd-199d431e5f2b" width="1200" />
</p>


### Key Features

- **Personalized Meal Planning**
  - AI-generated meal plans based on user profiles
  - Dietary restrictions and preferences handling
  - Multiple plan management

- **Marathon Performance Prediction**
  - ML-powered runtime predictions
  - Performance trend visualization
  - Historical analysis

- **AI Workout Analysis**
  - Real-time posture correction
  - Video analysis for form improvement
  - Automated rep counting
  - Injury prevention insights

- **Intelligent Chatbots**
  - Specialized AI assistants for different domains
  - Context-aware recommendations
  - Personalized coaching

## Tech Stack 💻

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- TensorFlow.js
- Firebase Authentication

### Backend
- FastAPI (Python)
- Machine Learning Models
- Firebase Admin SDK
- Docker
- JWT Authentication

### Third-Party Services
- OpenAI API
- Firebase (Auth & Storage)
- TensorFlow

## Project Structure 📁
```
onepercent-athlete/
├──onepercent-frontend/   # Next.js frontend application
│   ├── src/              # souce code
│     ├── app/           
│       ├── chat/          
│       ├── Dashboard/       
│       ├── Components/
│       └── ...    
│   ├── public/           # Static assets
│   └── ...
├──onepercent-backend/    # FastAPI backend service
│   ├── app/              # Main application code
│   ├── ml/               # Machine learning models
│   └── ...
└── README.md             # Main documentation
```

## Prerequisites 📋

- Node.js (v18 or higher)
- Python 3.8+
- Docker and Docker Compose
- Git

## Installation & Setup 🛠️

1. Clone the repository:
```bash
git clone https://github.com/yourusername/one-percent-athlete-hackathon.git
cd one-percent-athlete-hackathon
```

2. Set up frontend:
```bash
cd frontend
npm install
```

3. Set up backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Environment Configuration:

Create `.env.local` in the frontend directory and `.env` in the backend directory. Required variables:

```env
# Frontend (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
OPENAI_API_KEY=your_openai_api_key

# Backend (.env)
OPENAI_API_KEY=your_openai_key
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PROJECT_ID=your_project_id
CREDS_PATH=app/certs/your-firebase-adminsdk.json
```

## Running the Application 🚀

### Development Mode

1. Frontend:
```bash
cd frontend
npm run dev
```

2. Backend:
```bash
cd backend
docker-compose up --build
```

Visit: 
- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs

### Production Mode

1. Frontend:
```bash
cd frontend
npm run build
npm start
```

2. Backend:
```bash
cd backend
docker-compose -f docker-compose.prod.yml up --build
```


## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Made with ❤️ by Hoyath
