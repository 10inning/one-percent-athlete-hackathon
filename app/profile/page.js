"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Profile = () => {
  const { user } = useUser();
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "metrics"),
            where("userId", "==", user.id) // Fetch data for the logged-in user
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => doc.data());
          setMetrics(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchMetrics();
  }, [user]);

  return (
    <div>
      <h1>Profile Dashboard</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.username}</h2>
          <ul>
            {metrics.map((metric, index) => (
              <li key={index}>{JSON.stringify(metric)}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Please sign in to view your data.</p>
      )}
    </div>
  );
};

export default Profile;
