import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { storage, db } from "../firebase";
import Image from "next/image";
import Pfp from "./Images/bigRecruitsLogo.png";
import "./EditProfileModal.css";

export default function EditProfileModal({ handleClick }) {
const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("");
  const [sport, setSport] = useState("");
  const [social, setSocial] = useState("");
  const [bio, setBio] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const { user } = useUser();

  const saveUserProfile = async (
    username,
    Name,
    Phone,
    Email,
    Grade,
    Sport,
    Social,
    Bio
  ) => {
    if (user) {
      const userId = user.id;
      const userRef = doc(db, "users", userId);
      try {
        let profilePictureUrl = null;
        if (uploadedFile) {
          const storageRef = ref(storage, `profilePictures/${userId}`);
          const snapshot = await uploadBytes(storageRef, uploadedFile);
          profilePictureUrl = await getDownloadURL(snapshot.ref);
        }

        await setDoc(
          userRef,
          {
            username,
            Name,
            Phone,
            Email,
            Grade,
            Sport,
            Social,
            Bio,
            ["Profile Picture"]: profilePictureUrl,
          },
          { merge: true }
        );
        setProfilePicture(profilePictureUrl);
      } catch (error) {
        console.error("Error saving user profile:", error);
      }
    } else {
      console.log("User is not authenticated");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserProfile(userName, name, phone, email, level, sport, social, bio);
    handleClick();
  };

  useEffect(() => {
    const getUserData = async () => {
        const userId = user.id;
        const userRef = doc(db, "users", userId);
      
        try {
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserName(userData.username || "");
            setName(userData.Name || "");
            setPhone(userData.Phone || "");
            setEmail(userData.Email || "");
            setLevel(userData.Grade || "");
            setSport(userData.Sport || "");
            setSocial(userData.Social || "");
            setBio(userData.Bio || "");
            setProfilePicture(userData["Profile Picture"] || null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      getUserData();
      
  }, [user])

  return (
    <div
      style={{
        backgroundColor: "rgb(11 11 11)",
        boxShadow: "0px 0px 20px rgb(20 20 20)",
        padding: "15px",
        borderRadius: "20px",
        width: "700px",
      }}
      className="userModalContainer"
    >
      <div style={{ width: "100%" }} className="userTopSectionn">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: "10px 0px" }}>Edit Information</h2>
          <svg
            onClick={handleClick}
            style={{ fontSize: "25px", color: "#d8303a", cursor: "pointer" }}
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <hr style={{ marginBottom: "10px", border: "0.1px solid #d8303a" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image
              style={{
                marginRight: "10px",
                border: "2px solid #d8303a",
                borderRadius: "50%",
              }}
              src={profilePicture ? profilePicture : Pfp}
              width={70}
              height={70}
              alt="Profile Picture"
            ></Image>
            <div>
              <h2 style={{ color: "white", margin: "0" }}>
                {name ? name : "Name: N/A"}
              </h2>
              <h5 style={{ color: "#d8303a", fontWeight: "400", margin: "0" }}>
                {email ? email : "Email: N/A"}
              </h5>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <button
              style={{
                marginRight: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <label
                htmlFor="fileUpload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <svg
                  style={{ marginRight: "10px" }}
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
                    d="M.5 8a.5.5 0 01.5.5V12a1 1 0 001 1h12a1 1 0 001-1V8.5a.5.5 0 011 0V12a2 2 0 01-2 2H2a2 2 0 01-2-2V8.5A.5.5 0 01.5 8zM5 4.854a.5.5 0 00.707 0L8 2.56l2.293 2.293A.5.5 0 1011 4.146L8.354 1.5a.5.5 0 00-.708 0L5 4.146a.5.5 0 000 .708z"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fillRule="evenodd"
                    d="M8 2a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8A.5.5 0 018 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {uploadedFile && (
                  <p
                    style={{
                      color: "#d8303a",
                      fontSize: "14px",
                    }}
                  >
                    Uploaded: {`${uploadedFile?.name.slice(0, 5)}...`}
                  </p>
                )}
                {!uploadedFile && <p>Upload</p>}
              </label>
              <input
                type="file"
                id="fileUpload"
                name="myImage"
                accept="image/png, image/gif, image/jpeg"
                style={{ display: "none" }}
                onChange={(e) => setUploadedFile(e.target.files[0])}
              />
            </button>
            <button
              onClick={() => setUploadedFile(null)}
              style={{
                backgroundColor: "rgb(255 0 0 / 18%)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                style={{ color: "#d8303a" }}
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "400px",
          overflow: "auto",
          marginTop: "30px",
          marginBottom: "20px",
        }}
        className="userMidSection"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
          className="userModalInputsFirstSection"
        >
          <div className="userModalInput">
          <p>User Name</p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <p>Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <p>Phone</p>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <p>Sport</p>
            <input
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            />
          </div>
          <div className="userModalInput">
            <p>Email</p>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <p>Grade</p>
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />

            <p>Social Link</p>
            <input
              type="text"
              value={social}
              onChange={(e) => setSocial(e.target.value)}
            />
          </div>
        </div>
        <div className="userInputBottomSection">
          <p>Bio</p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            name=""
            id=""
          ></textarea>
        </div>
      </div>
      <div
        style={{
          width: "99%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className="userBottomSection"
      >
        <button
          onClick={handleClick}
          style={{
            fontFamily: "Raleway, serif",
            fontSize: "20px",
            letterSpacing: "1px",
            color: "red",
            fontWeight: "300",
            width: "320px",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            fontFamily: "Raleway, serif",
            fontSize: "20px",
            letterSpacing: "1px",
            color: "white",
            fontWeight: "300",
            width: "320px",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
