import { useState } from "react";
import {
  signInWithGooglePopup,
  signinWithUserEmailAndPassword,
  userSignOut,
} from "../../utils/firebase/config";
import { useNavigate } from "react-router";
import "./Login.styles.scss";
import {IoLogoGoogle} from "react-icons/io5"
import { Link } from "react-router-dom";
import { Input } from "../Mini Components/Input/Input.component";
import { getUserProfile } from "../../utils/API/getUserProfile";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/User/User.selector";

const DEFAULT_FORM_VALUES = {
  email: "",
  password: "",
};

export const Login = () => {
  const [loginDetails, setLoginDetails] = useState(DEFAULT_FORM_VALUES);
  const { email, password } = loginDetails;
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGooglePopup();
      handleLogin();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleUserSignIn = async () => {
    try {
      await signinWithUserEmailAndPassword(email, password);
      handleLogin();
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          alert("Incorrect password. Please try again.");
          break;
        case "auth/user-not-found":
          alert("No user found with this email.");
          break;
        default:
          console.error("Sign-in error:", error);
      }
    }
  };

  const handleSignOut = () => {
    userSignOut();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  return (
    <div className="signin-form-container">
      <img className="login-logo" src="/logo.png" alt="" />
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <div className="input-container">
        <input
          label="Email"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          required
          value={email}
          />
        <input
          label="Password"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          required
          value={password}
        />
      </div>
      <div className="buttons-containers">
        <button onClick={handleUserSignIn}>Sign In</button>
        <button onClick={handleGoogleLogin}><IoLogoGoogle />Login with Google</button>
      </div>
      <Link to="/signup">Don&apos;t have a Account? Create</Link>
    </div>
  );
};
