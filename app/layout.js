import { UserProvider } from "./context/userContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <nav>
            <a href="/">Home</a>
            <a href="/profile">Profile</a>
            <a href="/chatbot">AI Coach</a>
          </nav>
          <main>{children}</main>
          <footer>
            <p>© 2024 Athlete Dashboard</p>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
