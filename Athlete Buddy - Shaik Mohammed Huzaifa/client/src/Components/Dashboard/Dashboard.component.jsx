import { Outlet, useNavigate } from "react-router";
import { SideBar } from "../SideBar/SideBar.component";
import "./Dashboard.styles.scss";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/User/User.selector";
import { useEffect, useState } from "react";
import {
  AthleteSelector,
  SelectAthleteToggle,
} from "../../store/athlete-details";
import { AthleteProfile } from "../Athlete_profile/Athlete_profile.components";
import { athlete_details } from "../../assets/data/athlete_details";

export const Dashboard = () => {
  const user = useSelector(userSelector);
  const athleteToggle = useSelector(SelectAthleteToggle);
  const athlete = useSelector(AthleteSelector);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div className="dashboard-layout">
      <SideBar />
      <div className="content">
        <Outlet />
      </div>
      {athleteToggle && <AthleteProfile Details={athlete} />}
    </div>
  );
};
