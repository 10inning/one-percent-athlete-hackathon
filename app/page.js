import React from "react";
import "./Components/page.css";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mainLandingPage">
        <div className="landingOverlay">
          <nav style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
            <Link href="/" passHref>
              <p
                style={{
                  display: "flex",
                  color: "white",
                  fontSize: "20px",
                  alignItems: "center",
                  letterSpacing: "2px",
                  fontWeight: 500,
                  fontFamily: "Raleway, serif",
                }}
              >
                <svg
                  style={{
                    color: "#ff0d0d",
                    fontSize: "30px",
                    marginRight: "10px",
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
                    d="M11.251.068a.5.5 0 01.227.58L9.677 6.5H13a.5.5 0 01.364.843l-8 8.5a.5.5 0 01-.842-.49L6.323 9.5H3a.5.5 0 01-.364-.843l8-8.5a.5.5 0 01.615-.09zM4.157 8.5H7a.5.5 0 01.478.647L6.11 13.59l5.732-6.09H9a.5.5 0 01-.478-.647L9.89 2.41 4.157 8.5z"
                    clipRule="evenodd"
                  ></path>
                </svg>{" "}
                1%Athlete
              </p>
            </Link>
            <Link href="/signin" passHref>
              <p
                style={{
                  fontSize: "20px",
                  display: "flex",
                  color: "white",
                  alignItems: "center",
                  letterSpacing: "2px",
                  fontWeight: 500,
                  fontFamily: "Raleway, serif",
                }}
              >
                <svg
                  style={{
                    color: "#ff0d0d",
                    fontSize: "30px",
                    marginRight: "10px",
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
                    d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM8 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Sign In
              </p>
            </Link>
          </nav>
          <div className="mainLandingMidSection">
            <h1>Athletes:</h1>
            <h1>Tr<span>AI</span>n Smarter,</h1>
            <h1><span>Game</span> Harder</h1>
            <p>Where Every Step Brings You Closer To Greatness</p>
          </div>
        </div>
      </div>
    </>
  );
}
