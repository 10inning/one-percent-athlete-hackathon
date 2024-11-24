"use client"; // Add this directive to make the file a client component

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
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
