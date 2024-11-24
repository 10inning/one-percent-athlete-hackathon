import React from "react";

export default function signInModal({ username, setUsername, password, setPassword, error, handleSignIn }) {

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="signInModalContainer"
    >
      <div className="landingOverlay"></div>
      <div
        style={{
          backgroundColor: "rgb(49 49 49 / 45%)",
          backdropFilter: "blur(5px)",
          padding: "20px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="signInModalMain"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="signIntopSection"
        >
          <h1 style={{ marginBottom: "15px", fontSize: "45px"}}>Login to your account</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p
            style={{
              marginBottom: "15px",
              fontSize: "25px",
              letterSpacing: "1px",
            }}
          >
            You must be logged in to perform this action.
          </p>

          {/* <div className="signInButtonsContainer">
            <button
              onClick={handleSignIn}
              style={{
                color: "black",
                backgroundColor: "#ffffff87",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                outline: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "19px",
                width: "600px",
                fontFamily: "Raleway, Serif",
                fontWeight: 600,
                padding: "10px 0px",
                marginBottom: "10px",
              }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 48 48"
                enableBackground="new 0 0 48 48"
                height="1.4em"
                width="2.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>{" "}
              Continue with Google
            </button>
            <button
              style={{
                color: "black",
                backgroundColor: "#ffffff87",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                outline: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "19px",
                width: "600px",
                fontFamily: "Raleway, Serif",
                fontWeight: 600,
                padding: "10px 0px",
                marginBottom: "15px",
              }}
            >
              <svg
                stroke="#1877F2"
                fill="#1877F2"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1.4em"
                width="2.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
              </svg>{" "}
              Continue with Facebook
            </button>
          </div> */}
        </div>
        {/* <p style={{ marginBottom: "15px" }}>OR</p> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="signInBottomSection"
        >
          <input
          type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            style={{
            width: "600px",
              background: "rgb(27 27 27 / 55%)",
              backdropFilter: "blur(10px)",
              border: "none",
              marginBottom: "10px",
              borderRadius: "5px",
              outline: "none",
              color: "white",
              fontSize: "19px",
              padding: "20px 20px",
            }}
          />
          <input
          type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            style={{
                width: "600px",
              background: "rgb(27 27 27 / 55%)",
              backdropFilter: "blur(10px)",
              border: "none",
              borderRadius: "5px",
              marginBottom: "10px",
              outline: "none",
              color: "white",
              fontSize: "19px",
              padding: "20px 20px",
            }}
          />
          <div
            style={{ width: "600px", marginBottom: "25px" }}
            className="resetPass"
          >
            {/* <a style={{ fontWeight: 700, textDecoration: "underline", color: "rgb(211, 211, 211)" }} href="">
              Reset your password?
            </a> */}
          </div>
        </div>
        <button
          style={{
            background: "rgb(0 0 0 / 40%)",
            backdropFilter: "blur(10px)",
            border: "none",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            outline: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "22px",
            width: "250px",
            padding: "15px 20px",
            marginBottom: "10px",
          }}
          onClick={handleSignIn}
        >
          Continue
        </button>
        <center>
          {/* <p>
            Don&apos;t have an account?
            <a style={{ marginLeft: "10px", fontWeight: 700, textDecoration: "underline", color: "rgb(211, 211, 211)" }} href="">
              Sign Up
            </a>
          </p> */}
        </center>
      </div>
    </div>
  );
}
