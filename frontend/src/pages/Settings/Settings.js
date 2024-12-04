import React, { useState, useEffect } from "react";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore"; // Import updateDoc and getDoc
import { db } from "../../firebase"; // Import db from firebase.js
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "../../global.css"; // Import global CSS
import "./settings.css";

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [username, setUsername] = useState(''); // Add username state
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePicture(userData.profilePicture || null);
          setUsername(user.email.split('@')[0]); // Extract username from email
        }
      }
    };
    fetchProfileData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Navigate to Landing page after sign-out
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

        // Navigate to Landing page after account deletion
        navigate("/");
      } catch (err) {
        console.error("Error deleting account: ", err);
      }
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfilePicture(reader.result);
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { profilePicture: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "profile":
        return (
          <div className="settings-content">
            <h3>Profile Settings</h3>
            <div className="profile-picture-section">
              <img src={profilePicture || "/path/to/default-avatar.jpg"} alt="Profile" className="profile-picture" />
              <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
            </div>
          </div>
        );
      case "account":
        return (
          <div className="settings-content">
            <h3>Account Settings</h3>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={() => setShowDeleteModal(true)} className="delete-button">Delete Account</button>
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
          <img src={profilePicture || "/path/to/default-avatar.jpg"} alt="User Avatar" />
          <span className="username">{username}</span>
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
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </aside>
      <main className="main-content">{renderSection()}</main>
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowDeleteModal(false)}>&times;</span>
            <h2>Confirm Account Deletion</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;