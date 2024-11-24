import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../context/userContext";
import Pfp from "./Images/bigRecruitsLogo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userId = user.id;
        const userRef = doc(db, "users", userId);
        try {
          const docSnapShot = await getDoc(userRef);
          if (docSnapShot.exists()) {
            const userData = docSnapShot.data();
            setName(userData.Name || "");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        console.log("User not authenticated");
      }
    };

    fetchUserData();
  }, [user]);
  const handleLogout = () => {
    setUser(null); // Clear the user from context
    router.push("/signin"); // Redirect to the sign-in page
  };

  return (
    <div
      style={{
        width: "300px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#2b2e36",
        padding: "20px 20px",
      }}
      className="sideBarContainer"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "20px",
          alignItems: "center",
        }}
        className="sidebarTopSection"
      >
        <Link href="/" passHref>
        <p
          style={{
            display: "flex",
            color: "#b5b5b5",
            alignItems: "center",
            letterSpacing: "2px",
            fontWeight: 500,
            fontFamily: "Raleway, serif",
          }}
        >
          <svg
            style={{ color: "#ff0d0d", fontSize: "30px", marginRight: "10px" }}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M11.251.068a.5.5 0 01.227.58L9.677 6.5H13a.5.5 0 01.364.843l-8 8.5a.5.5 0 01-.842-.49L6.323 9.5H3a.5.5 0 01-.364-.843l8-8.5a.5.5 0 01.615-.09zM4.157 8.5H7a.5.5 0 01.478.647L6.11 13.59l5.732-6.09H9a.5.5 0 01-.478-.647L9.89 2.41 4.157 8.5z"
              clipRule="evenodd"
            ></path>
          </svg>{" "}
          1%Athlete
        </p>
        </Link>
        <svg
          style={{ fontSize: "40px" }}
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        className="photoAndNameSection"
      >
        <Image
          style={{
            borderRadius: "50%",
            border: "Solid 2px red",
            marginBottom: "20px",
          }}
          src={Pfp}
          width={150}
          height={150}
          alt="Profile Picture"
        ></Image>
        <h1 style={{ fontWeight: "400", color: "#ff0d0d" }}>
          {name ? name : "Name: N/A"}
        </h1>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          flexDirection: "column",
          fontSize: "18px",
        }}
        className="sidebarMidSection"
      >
        <Link href="/profile" passHref>
        <p style={{ cursor: "pointer", marginBottom: "30px", display: "flex" }}>
          <svg
            style={{ marginRight: "20px" }}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M13 21V11h8v10h-8zM3 13V3h8v10H3zm6-2V5H5v6h4zM3 21v-6h8v6H3zm2-2h4v-2H5v2zm10 0h4v-6h-4v6zM13 3h8v6h-8V3zm2 2v2h4V5h-4z"></path>
            </g>
          </svg>{" "}
          Dashboard
        </p>
        </Link>
        <Link href="/chatbot" passHref>
        <p style={{ cursor: "pointer", marginBottom: "30px", display: "flex" }}>
          <svg
            style={{ marginRight: "20px" }}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M256 21.52l-4.5 2.597L52.934 138.76v234.48L256 490.48l203.066-117.24V138.76L256 21.52zm0 20.783l185.066 106.85v213.695L256 469.698 70.934 362.847V149.152L256 42.302zm0 30.93l-4.5 2.597-153.78 88.785v182.77L256 438.768l158.28-91.383v-182.77L256 73.232zm0 20.783l140.28 80.992v161.984L256 417.984l-140.28-80.992V175.008L256 94.016zm0 30.93l-4.5 2.597-108.998 62.93v131.054L256 387.055l113.498-65.528V190.473L256 124.945zm0 20.783l95.498 55.135v110.27L256 366.27l-95.498-55.135v-110.27L256 145.73zm0 30.928l-4.5 2.598-64.213 37.072v79.344L256 335.342l68.713-39.67v-79.344L256 176.658zm0 20.783l50.713 29.28v58.56L256 314.56l-50.713-29.28v-58.56L256 197.44zm0 30.93l-4.5 2.6-19.428 11.216v27.628L256 283.63l23.928-13.816v-27.628L256 228.37z"></path>
          </svg>{" "}
          AI Coach
        </p>
        </Link>
        <p style={{ cursor: "pointer", marginBottom: "30px", display: "flex" }}>
          <svg
            style={{ marginRight: "20px" }}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.995-.944v-.002.002zM7.022 13h7.956a.274.274 0 00.014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C13.688 10.629 12.718 10 11 10c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 00.022.004zm7.973.056v-.002.002zM11 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zM6.936 9.28a5.88 5.88 0 00-1.23-.247A7.35 7.35 0 005 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 015 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10c-1.668.02-2.615.64-3.16 1.276C1.163 11.97 1 12.739 1 13h3c0-1.045.323-2.086.92-3zM1.5 5.5a3 3 0 116 0 3 3 0 01-6 0zm3-2a2 2 0 100 4 2 2 0 000-4z"
              clipRule="evenodd"
            ></path>
          </svg>{" "}
          Coming Soon
        </p>
        <p style={{ cursor: "pointer", marginBottom: "30px", display: "flex" }}>
          <svg
            style={{ marginRight: "20px" }}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 352 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"></path>
          </svg>{" "}
          Coming Soon
        </p>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontSize: "18px",
        }}
        className="sidebarBottomSection"
      >
        <p style={{ cursor: "pointer", marginBottom: "30px", display: "flex" }}>
          <svg
            style={{ marginRight: "20px" }}
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>{" "}
          Settings
        </p>
        <p style={{ cursor: "pointer", display: "flex" }} onClick={handleLogout}>
          <svg
            style={{ marginRight: "20px" }}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 13L16 11 7 11 7 8 2 12 7 16 7 13z"></path>
            <path d="M20,3h-9C9.897,3,9,3.897,9,5v4h2V5h9v14h-9v-4H9v4c0,1.103,0.897,2,2,2h9c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z"></path>
          </svg>{" "}
          Log Out
        </p>
      </div>
    </div>
  );
}
