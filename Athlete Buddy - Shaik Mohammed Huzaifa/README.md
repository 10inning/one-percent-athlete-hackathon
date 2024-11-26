# Athlete Buddy

Athlete Buddy is a comprehensive platform designed to help athletes connect with others, get personalized exercise suggestions, receive training recommendations, and much more. This project consists of a **React.js frontend** and a **Django backend**.

---

## Folder Structure

```
Athlete_buddy/
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   ├── .env               # Environment variables for Firebase
│   ├── vite.config.js     # Vite configuration file
│   ├── package.json       # React dependencies and scripts
│   └── ...
├── backend/               # Django backend
│   ├── Athlete_buddy/     # Django app folder
│   ├── manage.py          # Django project management script
│   ├── requirements.txt   # Backend dependencies
│   ├── .env               # Backend environment variables
│   └── ...
├── README.md              # Project documentation
```

---

## Features

- **Frontend**: 
  - Developed with React.js and Vite for a fast and optimized UI.
  - Firebase integration for authentication and storage.
  - Interactive UI for athlete profiles, exercise recommendations, and community connections.

- **Backend**: 
  - Powered by Django REST Framework (DRF) for robust API development.
  - Azure OpenAI and OpenAI integration for generating personalized exercise suggestions and training recommendations.
  - AWS RDS MySQL for database storage.

---

## Environment Variables

### **Frontend (`client/.env`)**
| Key                           | Description                               |
|-------------------------------|-------------------------------------------|
| `VITE_FIREBASE_API_KEY`       | Firebase API key for authentication.     |
| `VITE_FIREBASE_AUTH_DOMAIN`   | Firebase Auth domain.                    |
| `VITE_PROJECT_ID`             | Firebase project ID.                     |
| `VITE_FIREBASE_STORAGE_BUCKET`| Firebase storage bucket.                 |
| `VITE_MESSAGING_SENDER_ID`    | Firebase messaging sender ID.            |
| `VITE_FIREBASE_APP_ID`        | Firebase application ID.                 |
| `VITE_FIREBASE_MEASUREMENT_ID`| Firebase analytics measurement ID.       |

### **Backend (`backend/.env`)**
| Key                       | Description                                 |
|---------------------------|---------------------------------------------|
| `AZURE_OPENAI_ENDPOINT`   | Endpoint for Azure OpenAI services.        |
| `AZURE_OPENAI_API_KEY`    | API key for Azure OpenAI.                  |
| `OPENAI_API_KEY`          | API key for OpenAI.                        |
| `OPENAI_ORGANISATION`     | OpenAI organization ID.                    |
| `AWS_RDS_USER`            | AWS RDS MySQL username.                    |
| `AWS_RDS_PASSWORD`        | AWS RDS MySQL password.                    |
| `AWS_RDS_ENDPOINT`        | AWS RDS endpoint.                          |
| `AWS_RDS_PORT`            | MySQL database port (default: 3306).       |
| `AWS_RDS_DATABASE`        | Name of the database used in the backend.  |

---

## Getting Started

### **Backend Setup**
1. **Navigate to the `backend` folder**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment** and install dependencies:
   ```bash
   python -m venv env
   source env/bin/activate   # For Linux/Mac
   env\Scripts\activate      # For Windows
   pip install -r requirements.txt
   ```

3. **Set up the database**:
   - Configure the `.env` file with AWS RDS details.
   - Run migrations:
     ```bash
     python manage.py migrate
     ```

4. **Run the development server**:
   ```bash
   python manage.py runserver
   ```

### **Frontend Setup**
1. **Navigate to the `client` folder**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## APIs

The backend exposes APIs for various operations, including fetching athlete details, exercise suggestions, and training plans. You can test the endpoints using tools like Postman or integrate them with the frontend.

---

## Deployment

- **Frontend**: Deploy the React app using platforms like Netlify or Vercel.
- **Backend**: Deploy the Django app on platforms like AWS Elastic Beanstalk, Heroku, or Azure App Services.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.

---