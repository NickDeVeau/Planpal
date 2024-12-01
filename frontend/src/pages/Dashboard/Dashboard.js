import React, { useState, useEffect } from "react";
import "../../global.css"; // Import global CSS
import "./dashboard.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import EventCard from "../../components/EventCard/EventCard";
import { db } from "../../firebase"; // Import Firestore
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore"; // Import Firestore functions

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch Projects from Firestore
  const fetchProjects = async () => {
    const projectsCollection = collection(db, "projects");
    const projectsSnapshot = await getDocs(projectsCollection);
    const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(projectsList);

    // Aggregate all tasks and events for the overview tab
    const allTasks = projectsList.flatMap((project) =>
      project.categories ? Object.entries(project.categories).flatMap(([sectionName, tasks]) =>
        tasks.map(task => ({ ...task, projectId: project.id, sectionName }))
      ) : []
    );
    const allEvents = projectsList.flatMap((project) =>
      project.events ? project.events.map(event => ({ ...event, projectId: project.id })) : []
    );

    setTasks(allTasks);
    setEvents(allEvents);
  };

  const addTask = async (projectId, sectionName) => {
    const taskTitle = prompt("Enter the task title:");
    if (taskTitle) {
      const newTask = {
        title: taskTitle,
        completed: false,
        priority: "low",
        description: "",
        dueDate: ""
      };
      const projectDoc = doc(db, "projects", projectId);
      const projectData = projects.find(project => project.id === projectId);
      const updatedCategories = {
        ...projectData.categories,
        [sectionName]: [...projectData.categories[sectionName], newTask]
      };
      await updateDoc(projectDoc, { categories: updatedCategories });
      fetchProjects(); // Refresh projects after adding a new task
    }
  };

  const addEvent = async (projectId) => {
    const eventTitle = prompt("Enter the event title:");
    if (eventTitle) {
      const newEvent = {
        title: eventTitle,
        date: "",
        duration: "all-day",
        priority: "low",
        description: ""
      };
      const projectDoc = doc(db, "projects", projectId);
      const projectData = projects.find(project => project.id === projectId);
      const updatedEvents = [...projectData.events, newEvent];
      await updateDoc(projectDoc, { events: updatedEvents });
      fetchProjects(); // Refresh projects after adding a new event
    }
  };

  const addProject = async () => {
    const projectName = prompt("Enter the project name:");
    if (projectName) {
      await addDoc(collection(db, "projects"), {
        name: projectName,
        type: "personal",
        categories: {},
        events: []
      });
      fetchProjects(); // Refresh projects after adding a new project
    }
  };

  const addSection = async (projectId) => {
    const sectionName = prompt("Enter the section name:");
    if (sectionName) {
      const projectDoc = doc(db, "projects", projectId);
      const projectData = projects.find(project => project.id === projectId);
      const updatedCategories = { ...projectData.categories, [sectionName]: [] };
      await updateDoc(projectDoc, { categories: updatedCategories });
      fetchProjects(); // Refresh projects after adding a new section
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
                  <button className="filter-btn">Filter By</button>
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
