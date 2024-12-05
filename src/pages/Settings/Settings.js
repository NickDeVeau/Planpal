import React, { useState, useEffect } from "react";
import { getAuth, signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../global.css";
import "./settings.css";

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null); // Add state for user
  const [projects, setProjects] = useState([]); // Add state for projects
  const [contributorEmails, setContributorEmails] = useState({}); // Add state for contributor emails
  const auth = getAuth();
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch profile data when user is available
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePicture(userData.profilePicture || null);
          setUsername(user.email.split('@')[0]);
        }
      }
    };
    fetchProfileData();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        const q = query(collection(db, "projects"), where("contributors", "array-contains", user.uid));
        const querySnapshot = await getDocs(q);
        const projectsData = [];
        const emails = {};
        for (const docSnapshot of querySnapshot.docs) {
          const projectData = docSnapshot.data();
          projectsData.push({ id: docSnapshot.id, ...projectData });
          for (const contributorId of projectData.contributors) {
            if (!emails[contributorId]) {
              const contributorDoc = await getDoc(doc(db, "users", contributorId));
              if (contributorDoc.exists()) {
                emails[contributorId] = contributorDoc.data().email;
              }
            }
          }
        }
        setProjects(projectsData);
        setContributorEmails(emails);
      }
    };
    fetchProjects();
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

  const handlePermissionChange = async (projectId, contributorId, permission, value) => {
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);
    if (projectDoc.exists()) {
      const projectData = projectDoc.data();
      const updatedPermissions = {
        ...projectData.permissions,
        [contributorId]: {
          ...projectData.permissions[contributorId],
          [permission]: value,
        },
      };
      await updateDoc(projectRef, { permissions: updatedPermissions });

      // Update state to reflect changes immediately
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, permissions: updatedPermissions }
            : project
        )
      );
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
      case "shared-projects":
        return (
          <div className="settings-content">
            <h3>Shared Projects</h3>
            {projects
              .filter(project => project.type === "shared" && project.admin === user.uid)
              .map(project => (
                <div key={project.id} className="project-permissions">
                  <h4>{project.name}</h4>
                  {project.contributors.map(contributorId => (
                    <div key={contributorId} className="contributor-permissions">
                      <span>{contributorEmails[contributorId]}</span>
                      <label>
                        <input
                          type="checkbox"
                          checked={project.permissions?.[contributorId]?.canEditTasks || false}
                          onChange={(e) => handlePermissionChange(project.id, contributorId, "canEditTasks", e.target.checked)}
                        />
                        Can Edit Tasks
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={project.permissions?.[contributorId]?.canAddTasks || false}
                          onChange={(e) => handlePermissionChange(project.id, contributorId, "canAddTasks", e.target.checked)}
                        />
                        Can Add Tasks
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={project.permissions?.[contributorId]?.canDeleteTasks || false}
                          onChange={(e) => handlePermissionChange(project.id, contributorId, "canDeleteTasks", e.target.checked)}
                        />
                        Can Delete Tasks
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={project.permissions?.[contributorId]?.canEditEvents || false}
                          onChange={(e) => handlePermissionChange(project.id, contributorId, "canEditEvents", e.target.checked)}
                        />
                        Can Edit Events
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={project.permissions?.[contributorId]?.canAddEvents || false}
                          onChange={(e) => handlePermissionChange(project.id, contributorId, "canAddEvents", e.target.checked)}
                        />
                        Can Add Events
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={project.permissions?.[contributorId]?.canDeleteEvents || false}
                          onChange={(e) => handlePermissionChange(project.id, contributorId, "canDeleteEvents", e.target.checked)}
                        />
                        Can Delete Events
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={project.permissions?.[contributorId]?.canEditSections || false}
                          onChange={(e) => handlePermissionChange(project.id, contributorId, "canEditSections", e.target.checked)}
                        />
                        Can Edit Sections
                      </label>
                    </div>
                  ))}
                </div>
              ))}
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
          <li
            className={selectedSection === "shared-projects" ? "active" : ""}
            onClick={() => setSelectedSection("shared-projects")}
          >
            Shared Projects
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