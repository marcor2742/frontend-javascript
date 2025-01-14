import React, { useState } from "react";
import "./index.css";
import Profile from "../Profile/Profile";
import logo from "./logo.png";
import propic from "../Profile/propic.jpeg";
import close from "./close.png";
import TaskAvaiable from "../TaskAvaiable/TaskAvaiable";
import TaskActive from "../TaskActive/TaskActive";
import { ExpandableSidebar } from "../ExpandableSidebar/ExpandableSidebar";
import Notification from "../Notification/Notification";

const Home = () => {
  const [isDivVisible, setIsDivVisible] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [activeChatType, setActiveChatType] = useState(null);

  const toggleDiv = () => {
    setIsDivVisible(!isDivVisible);
  };

  const toggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  return (
    <div className="home">
      <div className="navbar">
        <img src={logo} alt="logo" className="logo-image" />
        <button className="propic-button" onClick={toggleProfile}>
          {!isProfileVisible && (
            <img src={propic} alt="propic" className="propic-image" />
          )}
          {isProfileVisible && (
            <img src={close} alt="settings" className="propic-image" />
          )}
        </button>
      </div>
      <div className="undernavbar">
        <div className="expandable-sidebar-container">
          <ExpandableSidebar
            activeChatType={activeChatType}
            setActiveChatType={setActiveChatType}
          />
        </div>

        <div className={`content ${isDivVisible ? "content-reduced" : ""}`}>
          {isProfileVisible && <Profile />}
          <div className="task-container">
            <TaskAvaiable />
          </div>
          <div className="task-container">
            <TaskActive />
          </div>
          <div className="task-container">
            <Notification />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
