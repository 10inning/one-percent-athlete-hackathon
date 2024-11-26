import React from "react";
import "./PeopleWidget.styles.scss";
import { useDispatch } from "react-redux";
import {
  toggleAthleteDetails,
  updateAthleteDetails,
} from "../../store/athlete-details";

export const PeopleWidget = ({ athlete_details }) => {
  const dispatch = useDispatch();

  const HandleDetails = () => {
    dispatch(updateAthleteDetails(athlete_details));
    dispatch(toggleAthleteDetails());
  };
  return (
    <div className="people-widget">
      {athlete_details ? (
        athlete_details.map((athlete) => (
          <div key={athlete.id} className="athlete-card">
            <div className="athlete-info">
              <div className="main-profile">
                <img
                  src="/athlete.png"
                  alt={`${athlete.username}'s profile`}
                  className="profile-img"
                />
                <p>{athlete.full_name}</p>
              </div>
              <p className="info">{athlete.email}</p>
              <p className="info">{athlete.phone_number}</p>
              <p className="info">{athlete.sport_discipline}</p>
              <p className="info">
                <span>{athlete.skill_level}</span>
              </p>
            </div>
            <button className="details-button" onClick={HandleDetails}>
              Details
            </button>
          </div>
        ))
      ) : (
        <p>No Athlete</p>
      )}
    </div>
  );
};
