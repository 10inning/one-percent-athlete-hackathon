import { Route, Routes } from 'react-router'
import './App.css'
import { Home } from './Components/Home/Home.component'
import { Login } from './Components/Login/Login.component'
import { SignUp } from './Components/SignUp/SignUp.component'
import { Dashboard } from './Components/Dashboard/Dashboard.component'
import { SetCurrentUser, SetCurrentUserDetails } from './store/User/User.actions'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { onAuthUserStateChanged, createUserDocumentFromAuth } from './utils/firebase/config'
import { Profile } from './Components/Profile/Profile.component'
import { Chat } from "./Components/Chat/Chat.component";
import { getUserProfile } from "./utils/API/getUserProfile";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUserDetails(email, displayName) {
      const response = await getUserProfile(email, displayName);
      console.log(response);
      dispatch(SetCurrentUserDetails(response.user));
    }
    const unsubscribe = onAuthUserStateChanged((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      dispatch(SetCurrentUser(user));
      console.log(user);
      if (user) {
        getUserDetails(user.email, user.displayName);
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element="404 - Page Not Found" />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
