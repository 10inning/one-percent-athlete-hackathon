import { useState } from "react";
import "./Athlete_profile.styles.scss";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  AthleteSelector,
  toggleAthleteDetails,
} from "../../store/athlete-details";

export const AthleteProfile = () => {
  const dispatch = useDispatch();
  const Details = useSelector(AthleteSelector);

  const HandleClick = () => {
    dispatch(toggleAthleteDetails());
  };

  return (
    <div className="athlete-profile-container">
      <div className="athlete-profile">
        {/* Close Icon */}
        <div className="icon">
          <button onClick={HandleClick}>
            <IoClose />
          </button>
        </div>

        {/* Athlete Profile Header */}
        <div className="profile">
          <img src="/athlete.png" alt="Athlete profile" />
          <p>{Details[0]?.full_name || "No Name Provided"}</p>
        </div>

        {/* Athlete Details */}
        <div className="main-details">
          <h3>Details</h3>
          <ul>
            {Details[0] ? (
              <>
                <li>
                  <strong>Age:</strong> {Details[0].age || "N/A"}
                </li>
                <li>
                  <strong>Gender:</strong> {Details[0].gender || "N/A"}
                </li>
                <li>
                  <strong>Email:</strong> {Details[0].email || "N/A"}
                </li>
                <li>
                  <strong>Phone:</strong> {Details[0].phone_number || "N/A"}
                </li>
                <li>
                  <strong>Sport Discipline:</strong>{" "}
                  {Details[0].sport_discipline || "N/A"}
                </li>
                <li>
                  <strong>Position/Role:</strong>{" "}
                  {Details[0].position_role || "N/A"}
                </li>
                <li>
                  <strong>Skill Level:</strong>{" "}
                  {Details[0].skill_level || "N/A"}
                </li>
                <li>
                  <strong>Training Days/Week:</strong>{" "}
                  {Details[0].training_days_per_week || "N/A"}
                </li>
                <li>
                  <strong>Training Duration/Session:</strong>{" "}
                  {Details[0].training_duration_per_session || "N/A"} hours
                </li>
                <li>
                  <strong>Competitive Level:</strong>{" "}
                  {Details[0].competitive_level || "N/A"}
                </li>
                <li>
                  <strong>Height (cm):</strong> {Details[0].height_cm || "N/A"}{" "}
                  cm
                </li>
                <li>
                  <strong>Weight (kg):</strong> {Details[0].weight_kg || "N/A"}{" "}
                  kg
                </li>
                <li>
                  <strong>Body Fat (%):</strong>{" "}
                  {Details[0].body_fat_percentage || "N/A"}%
                </li>
                <li>
                  <strong>Medical Conditions/Injuries:</strong>{" "}
                  {Details[0].injuries_medical_conditions || "N/A"}
                </li>
              </>
            ) : (
              <p>No details available for this athlete.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
