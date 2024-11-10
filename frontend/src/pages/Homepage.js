import React, { useState, useEffect } from 'react';
import '../styles/homepage.css';

const Homepage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const [isExpanded, setIsExpanded] = useState(false); 
    const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(false); 
    const [showMenu, setShowMenu] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskPriority, setEditTaskPriority] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [editTaskDueDate, setEditTaskDueDate] = useState('');
    

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        setTasks([
            {
                id: 1,
                title: 'Frontend | Task Name',
                priority: 'High',
                description: 'Description',
                dueDate: 'Due Tomorrow'
            },
            {
                id: 2,
                title: 'Frontend | Task Name',
                priority: 'Low',
                description: 'Description',
                dueDate: 'Due 9/10/2024'
            },
        ]);

        return () => clearInterval(interval);
    }, []);

    const addTask = () => {
        if (!newTaskTitle.trim()) return;

        const newTask = {
            id: Date.now(), 
            title: newTaskTitle,
            priority: newTaskPriority,
            description: newTaskDescription,
            dueDate: newTaskDueDate
        };

        setTasks([...tasks, newTask]); 

        setNewTaskTitle('');
        setNewTaskPriority('');
        setNewTaskDescription('');
        setNewTaskDueDate('');
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
        setShowMenu(null);
    };

    const editTask = (id) => {
        const task = tasks.find((task) => task.id === id);
        if (task) {
            setEditingTaskId(id); 
            setEditTaskTitle(task.title);
            setEditTaskPriority(task.priority);
            setEditTaskDescription(task.description);
            setEditTaskDueDate(task.dueDate);
        }
        setShowMenu(null); 
    };

    const saveTask = () => {
        const updatedTasks = tasks.map((task) =>
            task.id === editingTaskId
                ? {
                      ...task,
                      title: editTaskTitle,
                      priority: editTaskPriority,
                      description: editTaskDescription,
                      dueDate: editTaskDueDate,
                  }
                : task
        );
        setTasks(updatedTasks);
        setEditingTaskId(null); 
    };
    

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded); 
    };

    const toggleRightSidebarExpand = () => {
        setIsRightSidebarExpanded(!isRightSidebarExpanded); 
    };

    const toggleMenu = (taskId) => {
        setShowMenu(showMenu === taskId ? null : taskId); 
    };

    return (
        <div className="body">
            <div className="sidebar">
                <div className="profile">
                    <div className="avatar">F</div>
                    <div className="profile-info">
                        <h3>First Lastname</h3>
                        <p>Title</p>
                    </div>
                </div>

                <div className="search-container">
                    <input type="text" placeholder="Search" />
                    <button className="clear-button">×</button>
                </div>

                <div className="nav-item active">Overview</div>
                
                <div className="nav-section">
                    <div className="nav-section-title">Taskboards</div>
                    <div className="nav-item">
                        <span className="star-icon">★</span>
                        <span>Dev Project</span>
                        <span className="shared-tag">SHARED</span>
                    </div>
                    <div className="nav-item">
                        <span className="star-icon">★</span>
                        <span>School</span>
                    </div>
                </div>

                <div className="settings-link">Settings</div>
            </div>

            <div className="main-content">
                <div className="header">
                    <h1>Today, {formatDate(currentDate)}</h1>
                </div>

                <div className="section-header">
                    <h2>Overview</h2>
                    <div className="header-actions">
                        <button className="icon-button" onClick={toggleExpand}>
                            {isExpanded ? '−' : '+'} 
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="task-input">
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Priority"
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Due Date"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                        />
                        <button onClick={addTask}>Add Task</button>
                    </div>
                )}


            {tasks.map(task => (
                <div key={task.id} className="task-card">
                    <div className="task-header">
                        <div className="task-title">
                            <div className={`priority-dot priority-${task.priority.toLowerCase()}`} />
                            <div>{task.title}</div>
                        </div>
                        <div style={{ color: '#666', fontSize: '13px' }}>{task.dueDate}</div>
                        <button onClick={() => toggleMenu(task.id)} className="menu-button">
                            ⋮
                        </button>
                        {showMenu === task.id && (
                            <div className="dropdown-menu">
                                <button onClick={() => editTask(task.id)}>Edit</button>
                                <button onClick={() => deleteTask(task.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                    <div className="task-description">{task.description}</div>
                </div>
            ))}

            </div>
            {editingTaskId && (
                <div className="task-edit-form">
                    <h3>Edit Task</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Priority"
                        value={editTaskPriority}
                        onChange={(e) => setEditTaskPriority(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={editTaskDescription}
                        onChange={(e) => setEditTaskDescription(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Due Date"
                        value={editTaskDueDate}
                        onChange={(e) => setEditTaskDueDate(e.target.value)}
                    />
                    <button onClick={saveTask}>Save Task</button>
                    <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                </div>
            )}

            <div className="right-sidebar">
                <div className="section-header">
                    <h2>Today's Events</h2>
                    <button className="icon-button" onClick={toggleRightSidebarExpand}>
                        {isRightSidebarExpanded ? '−' : '+'}
                    </button>
                </div>

                {isRightSidebarExpanded && (
                    <div className="task-input">
                        <input
                            type="text"
                            placeholder="Event Title"
                        />
                        <input
                            type="text"
                            placeholder="Event Details"
                        />
                        <button>Add Event</button>
                    </div>
                )}

                {!isRightSidebarExpanded && (
                    <div className="task-card">
                        <div className="task-header">
                            <div className="task-title">
                                <div className="priority-dot" />
                                <div>Dev Project | Event Name</div>
                            </div>
                            <button className="icon-button">⋮</button>
                        </div>
                        <div className="task-description">Description</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Homepage;
