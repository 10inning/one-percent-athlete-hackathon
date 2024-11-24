# One Percent Athlete 🏃‍♂️

A Next.js powered AI fitness platform that helps athletes optimize their performance through personalized meal planning, workout analysis, and intelligent coaching.

## Features 🌟

### Personalized Meal Planning
- AI-powered meal plan generation based on your profile
- Customization considering:
  - Dietary restrictions
  - Food preferences
  - Allergies
  - BMI and other health metrics
- Save and manage multiple meal plans
- Generate alternative plans on demand

### Marathon Performance Prediction
- ML-powered runtime prediction model
- Visualization of performance trends
- Data-driven insights for achieving target times
- Historical performance analysis

### AI Workout Analysis
- Real-time posture correction
- Video analysis for form improvement
- Automatic rep counting (currently supports push-ups)
- Injury prevention insights
- Detailed feedback on form and technique

### Intelligent Chatbots
- Multiple specialized AI assistants:
  - General fitness coach
  - Nutrition specialist
  - Workout advisor
- Personalized responses based on user profile
- Context-aware recommendations

## Tech Stack 💻

- Next.js
- TypeScript
- Firebase Authentication
- TensorFlow.js (for ML models)
- OpenAI API
- Tailwind CSS

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation 🛠️

1. Clone the repository:
```bash
git clone https://github.com/yourusername/one-percent-athlete.git
cd one-percent-athlete
```

2. Install dependencies:
```bash
npm install

```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev

```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Scripts 📜

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm test` - Run tests

## Project Structure 📁

```
one-percent-athlete/
├── components/            # Reusable UI components
├── pages/                # Next.js pages
├── public/              # Static assets
├── styles/             # Global styles and Tailwind config
├── lib/                # Utility functions and helpers
├── models/             # ML models and types
├── services/           # API and external service integrations
├── hooks/              # Custom React hooks
├── context/            # React context providers
└── types/              # TypeScript type definitions
```


## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.



Made with ❤️ by the One Percent Athlete Team
