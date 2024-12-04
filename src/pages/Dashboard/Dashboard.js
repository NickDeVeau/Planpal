import React, { useState, useEffect, useRef } from "react";
import "../../global.css"; // Import global CSS
import "./dashboard.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import EventCard from "../../components/EventCard/EventCard";
import { db } from "../../firebase"; // Import Firestore
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { getAuth } from "firebase/auth";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSharedProject, setIsSharedProject] = useState(false); // Add state for shared project
  const [showAddContributorModal, setShowAddContributorModal] = useState(false);
  const [contributorEmail, setContributorEmail] = useState("");
  const [showProjectOptions, setShowProjectOptions] = useState(false);
  const [projectOptionsPosition, setProjectOptionsPosition] = useState({ x: 0, y: 0 });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const username = user ? user.email.split('@')[0] : '';

  const projectInputRef = useRef(null);
  const sectionInputRef = useRef(null);
  const taskInputRef = useRef(null);
  const eventInputRef = useRef(null);

  useEffect(() => {
    if (showProjectModal) projectInputRef.current.focus();
    if (showSectionModal) sectionInputRef.current.focus();
    if (showTaskModal) taskInputRef.current.focus();
    if (showEventModal) eventInputRef.current.focus();
  }, [showProjectModal, showSectionModal, showTaskModal, showEventModal]);

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  // Fetch Projects from Firestore
  const fetchProjects = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const projects = userData.projects || [];
      setProjects(projects);

      // Extract all tasks from all projects' categories
      const allTasks = [];
      const allEvents = [];

      projects.forEach((project) => {
        // Extract tasks from categories
        if (project.categories) {
          Object.entries(project.categories).forEach(([sectionName, tasks]) => {
            tasks.forEach((task) => {
              allTasks.push({ ...task, projectId: project.id, sectionName });
            });
          });
        }

        // Extract events
        if (project.events) {
          project.events.forEach((event) => {
            allEvents.push({ ...event, projectId: project.id });
          });
        }
      });

      setTasks(allTasks);
      setEvents(allEvents);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProjects(user.uid);
      } else {
        // Handle the case where the user is not authenticated
        console.error("User is not authenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const addProject = async () => {
    if (newProjectName) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const newProject = {
            id: new Date().getTime().toString(), // Generate a unique ID for the project
            name: newProjectName,
            type: isSharedProject ? "shared" : "personal", // Set project type based on checkbox
            categories: {},
            events: [],
            admin: user.uid, // Set the current user as the admin
            contributors: isSharedProject ? [user.uid] : [] // Initialize contributors array
          };
          const updatedProjects = [...(userData.projects || []), newProject];
          await updateDoc(userDocRef, { projects: updatedProjects });
          fetchProjects(user.uid); // Refresh projects after adding a new project
          setShowProjectModal(false);
          setNewProjectName("");
          setIsSharedProject(false); // Reset shared project state
        }
      }
    }
  };

  const addTask = async (projectId, sectionName) => {
    if (newTaskTitle) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedProjects = userData.projects.map((project) => {
            if (project.id === projectId) {
              const updatedCategories = {
                ...project.categories,
                [sectionName]: [
                  ...(project.categories[sectionName] || []),
                  {
                    id: new Date().getTime().toString(),
                    title: newTaskTitle,
                    completed: false,
                    priority: "low",
                    description: "",
                    dueDate: ""
                  }
                ]
              };
              return {
                ...project,
                categories: updatedCategories
              };
            }
            return project;
          });
          await updateDoc(userDocRef, { projects: updatedProjects });
          fetchProjects(user.uid); // Refresh projects after adding a new task
          setShowTaskModal(false);
          setNewTaskTitle("");
        }
      }
    }
  };

  const addEvent = async (projectId) => {
    if (newEventTitle) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedProjects = userData.projects.map((project) => {
            if (project.id === projectId) {
              const updatedEvents = [
                ...project.events,
                {
                  id: new Date().getTime().toString(),
                  title: newEventTitle,
                  date: "",
                  duration: "all-day",
                  priority: "low",
                  description: ""
                }
              ];
              return {
                ...project,
                events: updatedEvents
              };
            }
            return project;
          });
          await updateDoc(userDocRef, { projects: updatedProjects });
          fetchProjects(user.uid); // Refresh projects after adding a new event
          setShowEventModal(false);
          setNewEventTitle("");
        }
      }
    }
  };

  const addSection = async (projectId) => {
    if (newSectionName) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedProjects = userData.projects.map((project) => {
            if (project.id === projectId) {
              return {
                ...project,
                categories: {
                  ...project.categories,
                  [newSectionName]: []
                }
              };
            }
            return project;
          });
          await updateDoc(userDocRef, { projects: updatedProjects });
          fetchProjects(user.uid); // Refresh projects after adding a new section
          setShowSectionModal(false);
          setNewSectionName("");
        }
      }
    }
  };

  const addContributor = async (projectId) => {
    if (contributorEmail) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedProjects = userData.projects.map((project) => {
            if (project.id === projectId) {
              return {
                ...project,
                contributors: [...project.contributors, contributorEmail]
              };
            }
            return project;
          });
          await updateDoc(userDocRef, { projects: updatedProjects });
          fetchProjects(user.uid); // Refresh projects after adding a contributor
          setShowAddContributorModal(false);
          setContributorEmail("");
        }
      }
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    applySort(e.target.value);
  };

  const applySort = (option) => {
    let sortedTasks = [...tasks];
    let sortedEvents = [...events];

    if (option === "priority") {
      const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
      sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      sortedEvents.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (option === "date") {
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (option === "name") {
      sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
      sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
    }

    setTasks(sortedTasks);
    setEvents(sortedEvents);
  };

  const filterTasksAndEventsForToday = () => {
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  
    const tasksForToday = tasks.filter(task => task.dueDate === today);
    const eventsForToday = events.filter(event => event.date === today);
  
    return { tasksForToday, eventsForToday };
  };

  const toggleProjectOptions = (event, projectId) => {
    setSelectedProjectId(projectId);
    setProjectOptionsPosition({ x: event.clientX, y: event.clientY });
    setShowProjectOptions(!showProjectOptions);
  };

  const confirmDeleteProject = () => {
    setShowDeleteProjectModal(true);
  };

  const handleDeleteProject = async () => {
    const user = auth.currentUser;
    if (user && selectedProjectId) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedProjects = userData.projects.filter((project) => project.id !== selectedProjectId);
        await updateDoc(userDocRef, { projects: updatedProjects });
        fetchProjects(user.uid); // Refresh projects after deleting a project
        setShowDeleteProjectModal(false);
        setShowProjectOptions(false);
      }
    }
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePicture(userData.profilePicture || null);
        }
      }
    };
    fetchProfilePicture();
  }, [user]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-info">
          <img src={profilePicture || "/path/to/default-avatar.jpg"} alt="User Avatar" />
          <span className="username">{username}</span>
        </div>
        <div>
          <h2>Projects</h2>
          <ul>
            <li
              className={selectedTab === "overview" ? "active" : ""}
              onClick={() => setSelectedTab("overview")}
            >
              Overview
            </li>
            {projects.map((project) => (
              <li
                key={project.id}
                className={selectedTab === project.id ? "active" : ""}
                onClick={() => setSelectedTab(project.id)}
              >
                {project.name} {project.type === "shared" && <span>(Shared)</span>}
                <button className="options-btn" onClick={(e) => toggleProjectOptions(e, project.id)}>⋮</button>
              </li>
            ))}
          </ul>
          <button className="add-project-btn" onClick={() => setShowProjectModal(true)}>+ Add Project</button>
        </div>
        <button className="settings-btn" onClick={() => (window.location.href = "/settings")}>
          Settings
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {selectedTab === "overview" ? (
          <>
            <h2>Today's Overview</h2>
            <div className="panel-container">
              {/* Tasks Panel */}
              <div className="panel">
                <div className="tasks-header">
                  <h3>Tasks</h3>
                  <select className="sort-select" value={sortOption} onChange={handleSortChange}>
                    <option value="">Sort By</option>
                    <option value="priority">Priority</option>
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                <ul className="tasks-list">
                  {filterTasksAndEventsForToday().tasksForToday.map((task) => (
                    <TaskCard key={task.id} task={task} projectId={task.projectId} sectionName={task.sectionName} fetchProjects={fetchProjects} />
                  ))}
                </ul>
              </div>

              {/* Events Panel */}
              <div className="panel">
                <h3>Events</h3>
                <select className="sort-select" value={sortOption} onChange={handleSortChange}>
                  <option value="">Sort By</option>
                  <option value="priority">Priority</option>
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                </select>
                <ul className="events-list">
                  {filterTasksAndEventsForToday().eventsForToday.map((event) => (
                    <EventCard key={event.id} event={event} projectId={event.projectId} fetchProjects={fetchProjects} />
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2>
              {projects.find((project) => project.id === selectedTab)?.name}
              <button className="add-contributor-btn" onClick={() => setShowAddContributorModal(true)}>+</button>
            </h2>
            <div className="panel-container">
              {/* Project Tasks Panel */}
              <div className="panel">
                <div className="tasks-header">
                  <h3>Tasks</h3>
                  <button className="add-section-btn" onClick={() => setShowSectionModal(true)}>+ Add Section</button>
                  <select className="sort-select" value={sortOption} onChange={handleSortChange}>
                    <option value="">Sort By</option>
                    <option value="priority">Priority</option>
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                {projects.find((project) => project.id === selectedTab)?.categories &&
                  Object.entries(projects.find((project) => project.id === selectedTab).categories).map(
                    ([category, tasks]) => (
                      <div key={category}>
                        <h4>{category}</h4>
                        <button className="add-task-btn" onClick={() => { setSelectedSection(category); setShowTaskModal(true); }}>+ Add Task</button>
                        <ul className="tasks-list">
                          {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} projectId={selectedTab} sectionName={category} fetchProjects={fetchProjects} />
                          ))}
                        </ul>
                      </div>
                    )
                  )}
              </div>

              {/* Project Events Panel */}
              <div className="panel">
                <h3>Events</h3>
                <button className="add-event-btn" onClick={() => setShowEventModal(true)}>+ Add Event</button>
                <select className="sort-select" value={sortOption} onChange={handleSortChange}>
                  <option value="">Sort By</option>
                  <option value="priority">Priority</option>
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                </select>
                <ul className="events-list">
                  {projects.find((project) => project.id === selectedTab)?.events.map((event) => (
                    <EventCard key={event.id} event={event} projectId={selectedTab} fetchProjects={fetchProjects} />
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
        {showProjectModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowProjectModal(false)}>&times;</span>
              <h2>Add New Project</h2>
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                ref={projectInputRef}
                onKeyPress={(e) => handleKeyPress(e, addProject)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={isSharedProject}
                  onChange={(e) => setIsSharedProject(e.target.checked)}
                />
                Shared Project
              </label>
              <button className="apply-btn" onClick={addProject}>Add Project</button>
              <button className="cancel-btn" onClick={() => setShowProjectModal(false)}>Cancel</button>
            </div>
          </div>
        )}
        {showSectionModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowSectionModal(false)}>&times;</span>
              <h2>Add New Section</h2>
              <input
                type="text"
                placeholder="Section Name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                ref={sectionInputRef}
                onKeyPress={(e) => handleKeyPress(e, () => addSection(selectedTab))}
              />
              <button className="apply-btn" onClick={() => addSection(selectedTab)}>Add Section</button>
              <button className="cancel-btn" onClick={() => setShowSectionModal(false)}>Cancel</button>
            </div>
          </div>
        )}
        {showTaskModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowTaskModal(false)}>&times;</span>
              <h2>Add New Task</h2>
              <input
                type="text"
                placeholder="Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                ref={taskInputRef}
                onKeyPress={(e) => handleKeyPress(e, () => addTask(selectedTab, selectedSection))}
              />
              <button className="apply-btn" onClick={() => addTask(selectedTab, selectedSection)}>Add Task</button>
              <button className="cancel-btn" onClick={() => setShowTaskModal(false)}>Cancel</button>
            </div>
          </div>
        )}
        {showEventModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowEventModal(false)}>&times;</span>
              <h2>Add New Event</h2>
              <input
                type="text"
                placeholder="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                ref={eventInputRef}
                onKeyPress={(e) => handleKeyPress(e, () => addEvent(selectedTab))}
              />
              <button className="apply-btn" onClick={() => addEvent(selectedTab)}>Add Event</button>
              <button className="cancel-btn" onClick={() => setShowEventModal(false)}>Cancel</button>
            </div>
          </div>
        )}
        {showAddContributorModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowAddContributorModal(false)}>&times;</span>
              <h2>Add Contributor</h2>
              <input
                type="email"
                placeholder="Contributor Email"
                value={contributorEmail}
                onChange={(e) => setContributorEmail(e.target.value)}
              />
              <button className="apply-btn" onClick={() => addContributor(selectedTab)}>Add</button>
              <button className="cancel-btn" onClick={() => setShowAddContributorModal(false)}>Cancel</button>
            </div>
          </div>
        )}
        {showProjectOptions && (
          <div className="options-menu" style={{ top: projectOptionsPosition.y, left: projectOptionsPosition.x }}>
            <div className="option delete-option" onClick={confirmDeleteProject}>Delete</div>
          </div>
        )}
        {showDeleteProjectModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowDeleteProjectModal(false)}>&times;</span>
              <h2>Confirm Project Deletion</h2>
              <p>Are you sure you want to delete this project? This action cannot be undone.</p>
              <button className="delete-btn" onClick={handleDeleteProject}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteProjectModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
