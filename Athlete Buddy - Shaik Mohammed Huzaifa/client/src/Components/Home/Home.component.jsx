import { useEffect, useState } from "react";
import "./Home.styles.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/User/User.selector";

export const Home = () => {
  const [Loggedin, setLoggedIn] = useState(false);
  const user = useSelector(userSelector);
  console.log(user);
  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user]);
  return (
    <div className="home-container">
      <img src="/background.png" alt="" className="cover-image" />
      <div className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <p>Athlete Buddy</p>
        </div>
        {Loggedin ? (
          <div className="buttons">
            <Link to="dashboard">
              <button>Dashboard</button>
            </Link>
          </div>
        ) : (
          <div className="buttons">
            <Link to="login">
              <button>LogIn</button>
            </Link>
            <Link to="signup">
              <button>SignUp</button>
            </Link>{" "}
          </div>
        )}
      </div>
    </div>
  );
};
