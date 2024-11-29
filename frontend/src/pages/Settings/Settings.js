import React, { useState } from "react";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Import db from firebase.js
import "../../global.css"; // Import global CSS
import "./settings.css";

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // Navigate to Landing page after sign-out
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        // Delete user data from Firestore
        await deleteDoc(doc(db, "users", user.uid));
        // Delete user from Firebase Auth
        await deleteUser(user);
        window.location.href = "/"; // Navigate to Landing page after account deletion
      } catch (err) {
        console.error("Error deleting account: ", err);
      }
    }
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "profile":
        return (
          <div className="settings-content">
            <h3>Profile Settings</h3>
            {/* Add profile settings options here */}
          </div>
        );
      case "account":
        return (
          <div className="settings-content">
            <h3>Account Settings</h3>
            {/* Add account settings options here */}
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={handleDeleteAccount} className="delete-button">Delete Account</button>
          </div>
        );
      case "notifications":
        return (
          <div className="settings-content">
            <h3>Notification Settings</h3>
            {/* Add notification settings options here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <aside className="sidebar">
        <div className="user-info">
          <img src="/path/to/avatar.jpg" alt="User Avatar" />
          <span className="username">Username</span>
        </div>
        <ul>
          <li
            className={selectedSection === "profile" ? "active" : ""}
            onClick={() => setSelectedSection("profile")}
          >
            Profile
          </li>
          <li
            className={selectedSection === "account" ? "active" : ""}
            onClick={() => setSelectedSection("account")}
          >
            Account
          </li>
          <li
            className={selectedSection === "notifications" ? "active" : ""}
            onClick={() => setSelectedSection("notifications")}
          >
            Notifications
          </li>
        </ul>
        <button className="back-btn" onClick={() => (window.location.href = "/dashboard")}>
          Back to Dashboard
        </button>
      </aside>
      <main className="main-content">{renderSection()}</main>
    </div>
  );
};

export default Settings;