import { UserProvider } from "./context/userContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Link to Raleway font from Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;900&display=swap"
        />
      </head>
      <body style={{ fontFamily: "Raleway, sans-serif" }}>
        <UserProvider>
          {/* <nav style={{position: "absolute", right: 10, top: 10, fontSize: "20px"}}>
            <a href="/">Home</a>
            <a href="/profile">Profile</a>
            <a href="/chatbot">AI Coach</a>
          </nav> */}
          <main>{children}</main>
          {/* <footer>
            <p>© 2024 Athlete Dashboard</p>
          </footer> */}
        </UserProvider>
      </body>
    </html>
  );
}
