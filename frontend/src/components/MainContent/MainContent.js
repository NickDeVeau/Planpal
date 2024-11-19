import React from 'react';
import './maincontent.css';

const MainContent = ({
    tasks,
    currentDate,
    isExpanded,
    newTaskTitle,
    newTaskPriority,
    newTaskDescription,
    newTaskDueDate,
    setNewTaskTitle,
    setNewTaskPriority,
    setNewTaskDescription,
    setNewTaskDueDate,
    addTask,
    toggleExpand,
    showMenu,
    toggleMenu,
    editTask,
    deleteTask,
    editingTaskId,
    editTaskTitle,
    editTaskPriority,
    editTaskDescription,
    editTaskDueDate,
    setEditTaskTitle,
    setEditTaskPriority,
    setEditTaskDescription,
    setEditTaskDueDate,
    saveTask,
    formatDate,
    setEditingTaskId, // Add this line
}) => {
    return (
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
        </div>
    );
};

export default MainContent;
