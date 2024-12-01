import React, { useState, useEffect } from "react";
import "../../global.css"; // Import global CSS
import "./dashboard.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import EventCard from "../../components/EventCard/EventCard";
import { db, auth } from "../../firebase"; // Import Firestore and Auth
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [sortOption, setSortOption] = useState("");

  // Fetch Projects from Firestore
  const fetchProjects = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setProjects(userData.projects || []);
      setTasks(userData.tasks || []);
      setEvents(userData.events || []);
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
    const projectName = prompt("Enter the project name:");
    if (projectName) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const newProject = {
            id: new Date().getTime().toString(), // Generate a unique ID for the project
            name: projectName,
            type: "personal",
            categories: {},
            events: []
          };
          const updatedProjects = [...(userData.projects || []), newProject];
          await updateDoc(userDocRef, { projects: updatedProjects });
          fetchProjects(user.uid); // Refresh projects after adding a new project
        }
      }
    }
  };

  const addTask = async (projectId, sectionName) => {
    const taskTitle = prompt("Enter the task title:");
    if (taskTitle) {
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
                    title: taskTitle,
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
        }
      }
    }
  };

  const addEvent = async (projectId) => {
    const eventTitle = prompt("Enter the event title:");
    if (eventTitle) {
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
                  title: eventTitle,
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
        }
      }
    }
  };

  const addSection = async (projectId) => {
    const sectionName = prompt("Enter the section name:");
    if (sectionName) {
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
                  [sectionName]: []
                }
              };
            }
            return project;
          });
          await updateDoc(userDocRef, { projects: updatedProjects });
          fetchProjects(user.uid); // Refresh projects after adding a new section
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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-info">
          <img src="/path/to/avatar.jpg" alt="User Avatar" />
          <span className="username">Username</span>
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
              </li>
            ))}
          </ul>
          <button className="add-project-btn" onClick={addProject}>+ Add Project</button>
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
                  {tasks.map((task) => (
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
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} projectId={event.projectId} fetchProjects={fetchProjects} />
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2>{projects.find((project) => project.id === selectedTab)?.name}</h2>
            <div className="panel-container">
              {/* Project Tasks Panel */}
              <div className="panel">
                <div className="tasks-header">
                  <h3>Tasks</h3>
                  <button className="add-section-btn" onClick={() => addSection(selectedTab)}>+ Add Section</button>
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
                        <button className="add-task-btn" onClick={() => addTask(selectedTab, category)}>+ Add Task</button>
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
                <button className="add-event-btn" onClick={() => addEvent(selectedTab)}>+ Add Event</button>
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
      </main>
    </div>
  );
};

export default Dashboard;
