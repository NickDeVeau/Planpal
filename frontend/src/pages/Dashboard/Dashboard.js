import React, { useState, useEffect } from "react";
import "../../global.css"; // Import global CSS
import "./dashboard.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import EventCard from "../../components/EventCard/EventCard";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch Projects Mock Data
  const fetchProjects = async () => {
    const mockProjects = [
      {
        id: "1",
        name: "Personal Tasks",
        type: "personal",
        categories: {
          General: [
            {
              id: "t1",
              title: "Buy groceries",
              completed: false,
              priority: "low",
              description: "Get milk, bread, and eggs.",
              dueDate: "2024-11-26",
            },
            {
              id: "t2",
              title: "Finish project report",
              completed: true,
              priority: "high",
              description: "Complete the software engineering report.",
              dueDate: "2024-11-27",
            },
          ],
        },
        events: [
          {
            id: "e1",
            title: "Doctor's Appointment",
            date: "2024-11-26",
            priority: "medium",
          },
        ],
      },
      {
        id: "2",
        name: "Team Collaboration",
        type: "shared",
        categories: {
          Frontend: [
            {
              id: "t3",
              title: "Build Navbar",
              completed: false,
              priority: "medium",
              description: "Develop the main site navigation.",
              dueDate: "2024-11-28",
            },
          ],
          Backend: [
            {
              id: "t4",
              title: "Setup Database",
              completed: false,
              priority: "high",
              description: "Configure Firestore for the app.",
              dueDate: "2024-11-29",
            },
          ],
        },
        events: [
          {
            id: "e2",
            title: "Team Meeting",
            date: "2024-11-26",
            priority: "high",
          },
        ],
      },
    ];

    setProjects(mockProjects);

    // Aggregate all tasks and events for the overview tab
    const allTasks = mockProjects.flatMap((project) =>
      Object.values(project.categories).flat()
    );
    const allEvents = mockProjects.flatMap((project) => project.events);

    setTasks(allTasks);
    setEvents(allEvents);
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
          <button className="add-project-btn">+ Add Project</button>
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
                    <TaskCard key={task.id} task={task} />
                  ))}
                </ul>
              </div>

              {/* Events Panel */}
              <div className="panel">
                <h3>Events</h3>
                <ul className="events-list">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
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
                  <button className="add-section-btn">+ Add Section</button>
                </div>
                {projects.find((project) => project.id === selectedTab)?.categories &&
                  Object.entries(projects.find((project) => project.id === selectedTab).categories).map(
                    ([category, tasks]) => (
                      <div key={category}>
                        <h4>{category}</h4>
                        <ul className="tasks-list">
                          {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </ul>
                      </div>
                    )
                  )}
              </div>

              {/* Project Events Panel */}
              <div className="panel">
                <h3>Events</h3>
                <ul className="events-list">
                  {projects.find((project) => project.id === selectedTab)?.events.map((event) => (
                    <EventCard key={event.id} event={event} />
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
