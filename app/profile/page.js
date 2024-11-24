"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import Sidebar from "../Components/Sidebar";
import Circularbar from "../Components/CircularBar";
import Image from "next/image";
import Pfp from "../Components/Images/bigRecruitsLogo.png";
import "./profilePage.css";
import SearchBar from "../Components/SearchBar";
import EditProfileModal from "../Components/EditProfileModal";

const Profile = () => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [social, setSocial] = useState("");
  const [bodyWeight, setBodyWeight] = useState("");

  const [powerScore, setPowerScore] = useState("");
const [powerScoreLevel, setPowerScoreLevel] = useState("");

const [speedScore, setSpeedScore] = useState("");
const [speedScoreLevel, setSpeedScoreLevel] = useState("");

const [strengthScore, setStrengthScore] = useState("");
const [strengthScoreLevel, setStrengthScoreLevel] = useState("");

const [jumpScore, setJumpScore] = useState("");
const [jumpScoreLevel, setJumpScoreLevel] = useState("");


  const [searchBoxOpen, setSearchBoxOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);



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
            setSchool(userData.Grade || "");
            setSport(userData.Sport || "");
            setEmail(userData.Email || "");
            setPhone(userData.Phone || "");
            setSocial(userData.Social || "");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        console.log("User not authenticated");
      }
    };
    const fetchMetrics = async () => {
      if (user) {
        const userId = user.id;
        const userRef = doc(db, "metrics", userId);
        try {
          const docSnapShot = await getDoc(userRef);
          if (docSnapShot.exists()) {
            const userData = docSnapShot.data();
            isNaN(userData["Body Weight"])
              ? setBodyWeight("N/A")
              : setBodyWeight(userData["Body Weight"] || "");
            isNaN(userData["Power Score"])
              ? setPowerScore("N/A")
              : setPowerScore(userData["Power Score"] || "");
            isNaN(userData["Jump Score"])
              ? setJumpScore("N/A")
              : setJumpScore(userData["Jump Score"] || "");
            isNaN(userData["Relative Strength Score"])
              ? setStrengthScore("N/A")
              : setStrengthScore(userData["Relative Strength Score"] || "");
            isNaN(userData["Speed Score"])
              ? setSpeedScore("N/A")
              : setSpeedScore(userData["Speed Score"] || "");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        console.log("User not authenticated");
      }
    };

    if (strengthScore) {
      if (strengthScore > 2.75) {
        setStrengthScoreLevel("Div. I");
      } else if (strengthScore > 2.50) {
        setStrengthScoreLevel("Div. II");
      } else if (strengthScore > 2.25) {
        setStrengthScoreLevel("Div. III");
      } else if (strengthScore > 2.00) {
        setStrengthScoreLevel("VAR");
      } else if (strengthScore > 1.75) {
        setStrengthScoreLevel("JV");
      } else if (strengthScore > 1.50) {
        setStrengthScoreLevel("Fr");
      } else {
        setStrengthScoreLevel("N/A"); // Optional for scores less than or equal to 1.50
      }
    }

    if (powerScore) {
      if (powerScore > 41.47) {
        setPowerScoreLevel("Div. I");
      } else if (powerScore > 37.70) {
        setPowerScoreLevel("Div. II");
      } else if (powerScore > 33.93) {
        setPowerScoreLevel("Div. III");
      } else if (powerScore > 30.16) {
        setPowerScoreLevel("VAR");
      } else if (powerScore > 22.62) {
        setPowerScoreLevel("JV");
      } else if (powerScore > 15.08) {
        setPowerScoreLevel("Fr.");
      } else {
        setPowerScoreLevel("N/A");
      }
    }
    
    if (jumpScore) {
      if (jumpScore > 66.67) {
        setJumpScoreLevel("Div. I");
      } else if (jumpScore > 61.33) {
        setJumpScoreLevel("Div. II");
      } else if (jumpScore > 55.00) {
        setJumpScoreLevel("Div. III");
      } else if (jumpScore > 49.67) {
        setJumpScoreLevel("VAR");
      } else if (jumpScore > 43.17) {
        setJumpScoreLevel("JV");
      } else if (jumpScore > 36.67) {
        setJumpScoreLevel("Fr.");
      } else {
        setJumpScoreLevel("N/A");
      }
    }
    
    if (speedScore) {
      if (speedScore > 19.42) {
        setSpeedScoreLevel("Div. I");
      } else if (speedScore > 18.29) {
        setSpeedScoreLevel("Div. II");
      } else if (speedScore > 17.49) {
        setSpeedScoreLevel("Div. III");
      } else if (speedScore > 16.70) {
        setSpeedScoreLevel("VAR");
      } else if (speedScore > 15.92) {
        setSpeedScoreLevel("JV");
      } else if (speedScore > 14.38) {
        setSpeedScoreLevel("Fr.");
      } else {
        setSpeedScoreLevel("N/A");
      }
    }
    
    fetchUserData();
    fetchMetrics();
  }, [user, speedScore, jumpScore, strengthScore, powerScore]);

  const handleOpenSearchBox = () => {
    setSearchBoxOpen(!searchBoxOpen);
  };

  const handleClick = () => {
    setEditModalOpen(!editModalOpen);
  };

  return (
    <div style={{ width: "100%", display: "flex" }}>
      {/* {user ? (
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
      )} */}
      <Sidebar />
      <div
        style={{ padding: "20px 0px 20px 70px" }}
        className="mainProfilePage"
      >
        {editModalOpen && (
          <div
            style={{
              zIndex: 1000,
              backgroundColor: "rgb(0 0 0 / 75%)",
              height: "100vh",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <EditProfileModal handleClick={handleClick} />
          </div>
        )}
        {searchBoxOpen && (
          <SearchBar handleOpenSearchBox={handleOpenSearchBox} />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
          className="mainPageTop"
        >
          <div
            onClick={handleOpenSearchBox}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              paddingTop: 20,
            }}
            className="box findFriends"
          >
            <h1 style={{ fontWeight: 400, fontSize: "25px", color: "#c7c7c7" }}>
              Find Friends
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              position: "relative",
            }}
            className="box"
          >
            <svg
              style={{
                fontSize: "30px",
                position: "absolute",
                top: 10,
                right: 10,
                color: "red",
              }}
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M448 64h-25.98C438.44 92.28 448 125.01 448 160c0 105.87-86.13 192-192 192S64 265.87 64 160c0-34.99 9.56-67.72 25.98-96H64C28.71 64 0 92.71 0 128v320c0 35.29 28.71 64 64 64h384c35.29 0 64-28.71 64-64V128c0-35.29-28.71-64-64-64zM256 320c88.37 0 160-71.63 160-160S344.37 0 256 0 96 71.63 96 160s71.63 160 160 160zm-.3-151.94l33.58-78.36c3.5-8.17 12.94-11.92 21.03-8.41 8.12 3.48 11.88 12.89 8.41 21l-33.67 78.55C291.73 188 296 197.45 296 208c0 22.09-17.91 40-40 40s-40-17.91-40-40c0-21.98 17.76-39.77 39.7-39.94z"></path>
            </svg>
            <h1
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "80px",
                color: "red",
              }}
            >
              {bodyWeight} lbs
            </h1>
            <p style={{ fontSize: "20px" }}>Body Weight</p>
          </div>
          <div
            onClick={handleClick}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
            }}
            className="box"
          >
            <svg
              style={{
                fontSize: "30px",
                position: "absolute",
                top: 10,
                right: 10,
                color: "red",
              }}
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
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <svg
              style={{ fontSize: "150px", color: "red" }}
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
                d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM8 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <h1 style={{ fontWeight: 300, fontSize: "40px" }}>Edit Profile</h1>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="mainPageBottom"
        >
          <div className="performanceBox">
            <div className="box">
              <p>Relative Strength Score</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Circularbar currentNumber={strengthScore} maxNumber={2.75} />
                <h1
                  style={{
                    fontWeight: "400",
                    fontSize: "40px",
                    color: "#7f7f7f",
                  }}
                >
                  {strengthScoreLevel}
                </h1>
              </div>
              <div>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}
                  ></span>{" "}
                  Current Score
                </p>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#151515",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}
                  ></span>{" "}
                  Points until Next Level
                </p>
              </div>
            </div>
            <div className="box">
              <p>Power Score</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Circularbar currentNumber={powerScore} maxNumber={41.47} />
                <h1
                  style={{
                    fontWeight: "400",
                    fontSize: "40px",
                    color: "#7f7f7f",
                  }}
                >
                  {powerScoreLevel}
                </h1>
              </div>
              <div>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}
                  ></span>{" "}
                  Current Score
                </p>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#151515",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}
                  ></span>{" "}
                  Points until Next Level
                </p>
              </div>
            </div>
            <div className="box">
              <p>Jump Score</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Circularbar currentNumber={jumpScore} maxNumber={66.67} />
                <h1
                  style={{
                    fontWeight: "400",
                    fontSize: "40px",
                    color: "#7f7f7f",
                  }}
                >
                  {jumpScoreLevel}
                </h1>
              </div>
              <div>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}
                  ></span>{" "}
                  Current Score
                </p>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#151515",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}
                  ></span>{" "}
                  Points until Next Level
                </p>
              </div>
            </div>
            <div className="box">
              <p>Speed Score</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Circularbar currentNumber={speedScore} maxNumber={19.42} />
                <h1
                  style={{
                    fontWeight: "400",
                    fontSize: "40px",
                    color: "#7f7f7f",
                  }}
                >
                  {speedScoreLevel}
                </h1>
              </div>
              <div>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}
                  ></span>{" "}
                  Current Score
                </p>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#151515",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}
                  ></span>{" "}
                  Points until Next Level
                </p>
              </div>
            </div>
          </div>
          <div className="performanceBox2">
            <div
              style={{
                width: "400px",
                height: "400px",
                padding: 0,
                fontWeight: 300,
                fontSize: "20px",
              }}
              className="box"
            >
              <div className="bioImageContainer"></div>
              <p style={{ marginLeft: "10px", marginBottom: "10px" }}>
                Name:{" "}
                <span style={{ fontWeight: "600", color: "red" }}>
                  {name ? name : "N/A"}
                </span>
              </p>
              <p style={{ marginLeft: "10px", marginBottom: "10px" }}>
                Grade:{" "}
                <span style={{ fontWeight: "600", color: "red" }}>
                  {school ? school : "N/A"}
                </span>
              </p>
              <p style={{ marginLeft: "10px", marginBottom: "10px" }}>
                Sport:{" "}
                <span style={{ fontWeight: "600", color: "red" }}>
                  {sport ? sport : "N/A"}
                </span>
              </p>
              <p style={{ marginLeft: "10px", marginBottom: "10px" }}>
                Phone:{" "}
                <span style={{ fontWeight: "600", color: "red" }}>
                  {phone ? phone : "N/A"}
                </span>
              </p>
              <p style={{ marginLeft: "10px", marginBottom: "10px" }}>
                Email:{" "}
                <span style={{ fontWeight: "600", color: "red" }}>
                  {email ? email : "N/A"}
                </span>
              </p>
              <p style={{ marginLeft: "10px", marginBottom: "10px" }}>
                Social:{" "}
                <span style={{ fontWeight: "600", color: "red" }}>
                  {social ? social : "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
