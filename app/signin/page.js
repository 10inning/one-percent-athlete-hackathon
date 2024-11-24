"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { useUser } from "../context/userContext";
import { setCookie } from "cookies-next";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUser(); // Set the logged-in user in context

  const handleSignIn = async () => {
    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
  
        const isPasswordValid = await bcrypt.compare(password, userData.Password);
  
        if (isPasswordValid) {
          setUser({
            id: userDoc.id,
            username: userData.username,
            email: userData.email || "",
          });
  
          // Set a cookie for the logged-in user
          setCookie("user", JSON.stringify({ id: userDoc.id, username: userData.username }), {
            maxAge: 24 * 60 * 60, // 1 day
          });
  
          router.push("/profile"); // Redirect to profile page after login
        } else {
          setError("Invalid username or password.");
        }
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default SignIn;
