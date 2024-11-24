# AI Fitness Coach Web Application

**Team Members:**   
Atharva Ajit Waranashiwar \- \[[https://www.facebook.com/atharva.waranashiwar/](https://www.facebook.com/atharva.waranashiwar/)\]  
Yaffet Seboka \- \[[https://www.linkedin.com/in/yseboka/](https://www.linkedin.com/in/yseboka/)\]  
Yewoinhareg Geberemariam \- \[[https://www.linkedin.com/in/yewoinhareg-geberemariam-yewoin/](https://www.linkedin.com/in/yewoinhareg-geberemariam-yewoin/)

**UI Design** 1\)   
\[Figma Link\] \-   
[https://www.figma.com/design/wRtAxuCPWA868MxqE4gNsK/Hackathon?node-id=0-1\&node-type=canvas\&t=VEbO8SGEVwQc2AZA-0](https://www.figma.com/design/wRtAxuCPWA868MxqE4gNsK/Hackathon?node-id=0-1&node-type=canvas&t=VEbO8SGEVwQc2AZA-0) 

(\#) 2\) \[Video Link\] \- [https://drive.google.com/file/d/1mz4CGdRJHa4CvMbnsBnwMiIasZmXHP00/view?usp=sharing](https://drive.google.com/file/d/1mz4CGdRJHa4CvMbnsBnwMiIasZmXHP00/view?usp=sharing) 

## Overview

This web application is an AI-powered fitness coaching platform that provides personalized advice and feedback for athletes based on their fitness data. The application features user authentication, a dynamic chatbot interface, performance dashboards, and interactive data visualization.

---

## Features

### 1\. **AI Chatbot**

- Interactive chatbot powered by OpenAI GPT.  
- Personalized responses based on user data and metrics.  
- Markdown-like formatting in AI responses for better readability.

### 2\. **User Dashboard**

- Displays fitness metrics such as body weight, power score, jump score, speed score, and relative strength score.  
- Visual progress indicators for each metric.  
- Display other users 

### 3\. **Sidebar Navigation**

- Easy navigation to:  
  - Profile Dashboard  
  - AI Chatbot  
  - Settings  
  - Logout  
- User photo and name displayed dynamically.

### 4\. **Authentication**

- User login functionality.  
- Secure password storage using Firebase and bcrypt.js.  
- Logout functionality that redirects to the sign-in page.

---

## Technologies Used

### Frontend:

- **Next.js**: Framework for building server-side rendered React applications.  
- **CSS Modules**: For modular and reusable styling.  
- **Firebase Authentication**: Secure user authentication and data storage.

### Backend:

- **OpenAI API**: For generating chatbot responses.  
- **Firebase Firestore**: Cloud database for user and metrics data.

---

## Installation and Setup

1. **Clone the Repository:**  
     
   git clone https://github.com/your-repo/ai-fitness-coach.git  
     
   cd ai-fitness-coach  
     
2. **Install Dependencies:**  
     
   npm install  
     
3. **Set Up Environment Variables:**  
     
   - Create a `.env.local` file in the root directory and add the following:  
       
     NEXT\_PUBLIC\_OPENAI\_API\_KEY=your-openai-api-key  
       
     NEXT\_PUBLIC\_FIREBASE\_API\_KEY=your-firebase-api-key  
       
     NEXT\_PUBLIC\_FIREBASE\_AUTH\_DOMAIN=your-firebase-auth-domain  
       
     NEXT\_PUBLIC\_FIREBASE\_PROJECT\_ID=your-firebase-project-id

     
4. **Run the Development Server:**  
     
   npm run dev  
     
5. **Access the Application:** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

.

├── app/

│   ├── chatbot/

│   ├── profile/

│   ├── layout.js

│   └── page.js

├── components/

│   ├── Sidebar.js

│   ├── EditProfileModal.js

│   ├── CircularBar.js

├── context/

│   └── userContext.js

├── firebase/

│   └── firebase.js

├── public/

│   └── Images/

└── styles/

    └── globals.css

---

## How It Works

1. **User Authentication:**  
     
   - Users can sign in to access personalized data.  
   - Authentication is managed using Firebase.

   

2. **AI Chatbot:**  
     
   - The chatbot uses data from the Firestore database to provide tailored responses.  
   - Data includes fitness metrics like power score, jump score, etc.

   

3. **Dashboard Metrics:**  
     
   - Scores are categorized into performance levels such as JV, VAR, and Div. I.  
   - Circular progress bars visually represent the current performance level.

   

4. **Logout:**  
     
   - Logs the user out and redirects to the sign-in page.

---

## Future Enhancements

- Real-time data updates using Firebase Realtime Database.  
- Improved chatbot contextual awareness.  
- Mobile-friendly UI enhancements.  
- Integration with wearable devices for automated data updates.

---

## Contributing

Contributions are welcome\! Please fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

