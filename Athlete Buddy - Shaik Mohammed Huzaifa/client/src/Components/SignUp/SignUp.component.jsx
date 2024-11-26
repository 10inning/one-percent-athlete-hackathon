import "./SignUp.styles.scss"
import { useState } from "react";
import { IoLogoGoogle } from "react-icons/io5";
import {
  signupWithUserEmailAndPassword,
  createUserDocumentFromAuth,
  signInWithGooglePopup
} from "../../utils/firebase/config";
import { Link, useNavigate } from "react-router-dom";
const formDataDefault = {
  displayName: "",
  email: "",
  password: "",
  repeatpassword: "",
};

export const SignUp = () => {
  const [formData, setFormData] = useState(formDataDefault);
  const { displayName, email, password, repeatpassword } = formData;
  const navigate = useNavigate()

  const resetForm = () => {
    setFormData(formDataDefault);
  };

  const handleSignUp = async () => {
    try {
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGooglePopup();
      handleSignUp();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (repeatpassword !== password) {
      console.log("Your Password Doesn't Match");
      return;
    }

    try {
      const { user } = await signupWithUserEmailAndPassword(email, password);
      await createUserDocumentFromAuth(user, { displayName });
      resetForm();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot Create User Email Already Exists");
      } else {
        console.log("Error Occured during the creation of User", error);
      }
    }
  };

  const settingIndividualFieldData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="signup-form-container">
      <h2>Don&apos;t have an account?</h2>
      <span>Sign up with Email and password</span>
      <form action="" onSubmit={HandleSubmit}>
        <div>
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            onChange={settingIndividualFieldData}
            name="displayName"
            required
            value={displayName}
          />
        </div>
        <div>
          <label htmlFor="">Email</label>
          <input
            type="email"
            onChange={settingIndividualFieldData}
            name="email"
            required
            value={email}
          />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            onChange={settingIndividualFieldData}
            name="password"
            required
            value={password}
          />
        </div>
        <div>
          <label htmlFor="">Repeat Password</label>
          <input
            type="password"
            onChange={settingIndividualFieldData}
            name="repeatpassword"
            required
            value={repeatpassword}
          />
        </div>
        <button onClick={handleGoogleLogin}><IoLogoGoogle />Login with Google</button>
        <button type="Submit">Submit</button>
      </form>
      <div className="link">
      <Link to="/login">Already have a account? Log In</Link>
      </div>
    </div>
  );
};
