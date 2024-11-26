import "./Profile.styles.scss";
import { Input } from "../Mini Components/Input/Input.component";
import { Select } from "../Mini Components/Select/Select.component";
import { useEffect, useState } from "react";
import { athlete_details } from "../../assets/data/athlete_details"; // Update path to match your athlete options file
import { useDispatch, useSelector } from "react-redux";
import { userDetailsSelector } from "../../store/User/User.selector";
import { updateUserDetails } from "../../utils/API/update_Profile";
import { SetCurrentUserDetails } from "../../store/User/User.actions";

const DEFAULT_VALUES = {
  full_name: "",
  email: "",
  phone_number: "",
  age: "",
  gender: "",
  sport_discipline: "",
  skill_level: "",
  competitive_level: "",
  position_role: "",
  training_days_per_week: "",
  training_duration_per_session: "",
};

const AWS_CLOUDFRONT_DISTRIBUTION_URL = import.meta.env
  .VITE_AWS_CLOUDFRONT_DISTRIBUTION_URL;

export const Profile = () => {
  const [athleteDetails, setAthleteDetails] = useState(DEFAULT_VALUES);
  const userDetails = useSelector(userDetailsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userDetails) {
      setAthleteDetails({
        ...DEFAULT_VALUES,
        ...userDetails,
      });
    }
    console.log(athleteDetails);
  }, [userDetails]);

  const HandleValue = (e) => {
    const { name, value } = e.target;
    setAthleteDetails({
      ...athleteDetails,
      [name]: value,
    });
    console.log(value);
  };

  const HandleSubmit = async () => {
    const updatedAthleteDetails = await updateUserDetails(athleteDetails);
    dispatch(SetCurrentUserDetails(updatedAthleteDetails.user));
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-image">
        <div className="image">
          <img
            src={`${AWS_CLOUDFRONT_DISTRIBUTION_URL}/athlete-profile.png`}
            alt="Athlete"
          />
        </div>
        <div className="buttons">
          <button>Upload Image</button>
        </div>
      </div>
      <div className="user-details">
        <p className="header">Personal Details</p>
        <div className="inputs">
          <Input
            label="Name"
            type="text"
            value={athleteDetails.full_name}
            name="full_name"
            onChange={HandleValue}
          />
          <Input
            label="Email"
            type="email"
            value={athleteDetails.email}
            name="email"
            onChange={HandleValue}
          />
          <Input
            label="Phone"
            type="phone"
            value={athleteDetails.phone_number}
            name="phone_number"
            onChange={HandleValue}
          />
          <Input
            label="Age"
            type="number"
            value={athleteDetails.age}
            name="age"
            onChange={HandleValue}
          />
          <Select
            label="Gender"
            options={athlete_details.gender}
            value={athleteDetails.gender}
            name="gender"
            onChange={HandleValue}
          />
        </div>
      </div>
      <div className="user-details">
        <p className="header">Athlete Profile</p>
        <div className="inputs">
          <Select
            label="Sport Discipline"
            options={athlete_details.sport_discipline}
            value={athleteDetails.sport_discipline || ""}
            name="sport_discipline"
            onChange={HandleValue}
          />
          <Select
            label="Skill Level"
            options={athlete_details.skill_level}
            value={athleteDetails.skill_level || ""}
            name="skill_level"
            onChange={HandleValue}
          />
          <Select
            label="Competitive Level"
            options={athlete_details.competitive_level}
            value={athleteDetails.competitive_level || ""}
            name="competitive_level"
            onChange={HandleValue}
          />
          <Select
            label="Position/Role"
            options={athlete_details.position_role}
            value={athleteDetails.position_role || ""}
            name="position_role"
            onChange={HandleValue}
          />
          <Select
            label="Training Days/Week"
            options={athlete_details.training_days_per_week}
            value={athleteDetails.training_days_per_week || ""}
            name="training_days_per_week"
            onChange={HandleValue}
          />
          <Select
            label="Training Duration/Session"
            options={athlete_details.training_duration_per_session}
            value={athleteDetails.training_duration_per_session || ""}
            name="training_duration_per_session"
            onChange={HandleValue}
          />
        </div>
      </div>
      <button className="changes-button" onClick={HandleSubmit}>
        Save Changes
      </button>
    </div>
  );
};
