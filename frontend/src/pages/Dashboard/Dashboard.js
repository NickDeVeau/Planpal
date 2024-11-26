import React, { useState, useEffect } from "react";
import "./dashboard.css";

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
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {selectedTab === "overview" ? (
          <>
            <h2>Today's Overview</h2>
            <div className="panel-container">
              {/* Tasks Panel */}
              <div className="panel">
                <h3>Tasks</h3>
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
                <h3>Tasks</h3>
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

// TaskCard Component
const TaskCard = ({ task }) => {
  return (
    <li className={`task-card priority-${task.priority}`}>
      <div className="task-header">
        <div className="completion-status">
          <input type="checkbox" checked={task.completed} readOnly />
        </div>
        <h4 className="task-title">{task.title}</h4>
        <div className="task-meta">
          <span className="due-date">Due: {task.dueDate}</span>
          <span className={`priority-indicator priority-${task.priority}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-footer">
        <div className="task-actions">
          <button className="edit-btn">Edit</button>
          <button className="delete-btn">Delete</button>
        </div>
      </div>
    </li>
  );
};

// EventCard Component
const EventCard = ({ event }) => {
  return (
    <li className={`event-card priority-${event.priority}`}>
      <div className="event-header">
        <h4 className="event-title">{event.title}</h4>
        <div className="event-meta">
          <span className="event-date">{event.date}</span>
          <span className={`priority-indicator priority-${event.priority}`}>
            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
          </span>
        </div>
      </div>
      <div className="event-footer">
        <button className="edit-btn">Edit</button>
        <button className="delete-btn">Delete</button>
      </div>
    </li>
  );
};

export default Dashboard;
