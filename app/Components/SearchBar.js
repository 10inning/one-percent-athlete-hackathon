import React, { useEffect, useState } from 'react'
import Image from "next/image"
import Pfp from "../Components/Images/bigRecruitsLogo.png"
import {
    getDocs,
    collection,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "../firebase"
  import "./Searchbar.css"

export default function SearchBar({handleOpenSearchBox}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSearchedUsers = async (searchTerm) => {
        setLoading(true);
        const q = query(
          collection(db, "users"),
          where("Name", ">=", searchTerm),
          where("Name", "<=", searchTerm + "\uf8ff")
        );
    
        const querySnapshot = await getDocs(q);
        setLoading(false);
        const uniqueResults = new Map();
        querySnapshot.docs.forEach((doc) => {
          const data = {...doc.data()};
          if(!uniqueResults.has(data.Name)) {
            uniqueResults.set(data.Name, data);
          }
        })
        return Array.from(uniqueResults.values())
      };

    const handleSearch = async (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
    
        if (searchValue.trim().length > 0) {
          const users = await fetchSearchedUsers(searchValue);
          setResults(users);
        } else {
          setResults([]);
        }
      };

  return (
    <div
          style={{
            zIndex: 1000,
            backgroundColor: "rgb(0 0 0 / 35%)",
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
          className="searchBoxModalModalOverlay"
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              boxShadow: "0px 0px 5px black",
              backgroundColor: "#070707",
              width: "600px",
              height: "80%",
              borderRadius: "10px",
              padding: "20px",
            }}
            className="searchBoxModal"
          >
            <svg
              onClick={handleOpenSearchBox}
              style={{
                cursor: "pointer",
                position: "absolute",
                fontSize: "30px",
                color: "#969696",
                top: 10,
                right: 10,
                borderRadius: "50%",
                padding: "5px",
                backgroundColor: "rgb(14 14 14)",
              }}
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
            <div
              style={{ marginTop: "30px", width: "100%", position: "relative" }}
            >
              <svg
                style={{
                  position: "absolute",
                  fontSize: "25px",
                  zIndex: 1000,
                  top: 13,
                  left: 10,
                }}
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
                  d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"
                ></path>
              </svg>
              <input
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  backgroundColor: "rgb(14 14 14)",
                  fontFamily: "Raleway, serif",
                  color: "white",
                  width: "100%",
                  fontWeight: "600",
                  padding: "15px 45px",
                  fontSize: "17px",
                  border: "none",
                  outline: "none",
                  boxShadow: "0px 0px 5px #0000002b",
                  borderRadius: "1000px",
                  marginBottom: "40px",
                }}
                type="text"
                placeholder="Search Athlete"
              />
            </div>
            <div style={{ width: "100%", marginBottom: "40px" }}>
              <h1 style={{ color: "white", margin: 0, fontWeight: 400 }}>
                Top Results
              </h1>
              <p style={{ fontSize: "20px", margin: "20px 0 5px 0" }}>
                What are you looking for?
              </p>
              <div
                style={{ pointerEvents: "none", width: "100%", display: "flex" }}
                className="searchBoxModalButtons"
              >
                <button>
                  <svg
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
                      d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 100-6 3 3 0 000 6zm-5.784 6A2.238 2.238 0 015 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 005 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  People
                </button>
                <button>Coming Soon</button>
                <button>Coming Soon</button>
              </div>
            </div>
            <div
              style={{
                color: "#8c8c8c",
                width: "555px",
                height: "420px",
                backgroundColor: "#090909",
                borderRadius: "10px",
                padding: "20px",
                overflow: "auto",
              }}
              className="searchModalResultBox"
            >
              <p style={{ display: "flex", alignItems: "center" }}>
                People{" "}
                <span
                  style={{
                    color: "white",
                    backgroundColor: "#191919",
                    marginLeft: "20px",
                    borderRadius: "2px",
                    padding: "0px 5px",
                  }}
                >
                  {results.length}
                </span>
              </p>
              <hr
                style={{
                  height: "0.1px",
                  backgroundColor: "#111111",
                  border: "none",
                  margin: "10px 0 20px 0",
                }}
              />
              {loading ? (
                <p style={{ color: "white" }}>Loading...</p>
              ) : results.length > 0 ? (
                results.map((user, index) => (
                  <div
                  key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="searchResultUserProfile"
                    >
                      <Image
                        style={{
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                        src={Pfp}
                        alt="Pfp Logo"
                        width={65}
                        height={65}
                      />
                      <div
                        style={{ width: "300px" }}
                        className="nameSportLevel"
                      >
                        <p
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "white",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.Name}
                        </p>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                            color: "#696969",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.School ? user.School : "School N/A"} |{" "}
                          {user.Sport ? user.Sport : "Sport N/A"}
                        </p>
                      </div>
                    </div>
                    <button className="followUserButton">
                      <svg
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
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                      Follow
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: "white" }}>No results found</p>
              )}
            </div>
          </div>
        </div>
  )
}
