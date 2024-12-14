import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./taskCard.css";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db, auth } from "../../firebase"; // Import Firestore and auth

const TaskCard = ({ task, projectId, sectionName, fetchProjects }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const optionsRef = useRef(null);
  const [completed, setCompleted] = useState(task.completed);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const handleCheckboxChange = async () => {
    setCompleted(!completed);
    const user = auth.currentUser;
    if (user) {
      const projectRef = doc(db, "projects", projectId);
      const projectDoc = await getDoc(projectRef);
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();
        const updatedCategories = {
          ...projectData.categories,
          [sectionName]: projectData.categories[sectionName].map((t) =>
            t.id === task.id ? { ...t, completed: !completed } : t
          )
        };
        await updateDoc(projectRef, { categories: updatedCategories });
        fetchProjects(user.uid); // Refresh projects after updating task completion status
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  const checkPermissions = async (permissionType) => {
    const user = auth.currentUser;
    if (user) {
      const projectRef = doc(db, 'projects', projectId);
      const projectDoc = await getDoc(projectRef);
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();
        // Admin has all permissions
        if (projectData.admin === user.uid) return true;
        return projectData.permissions?.[user.uid]?.[permissionType];
      }
    }
    return false;
  };

  const handleEdit = async () => {
    if (await checkPermissions('canEditTasks')) {
      setIsEditing(true);
    } else {
      alert('You do not have permission to edit tasks.');
    }
  };

  const handleSave = async () => {
    if (await checkPermissions('canEditTasks')) {
      const user = auth.currentUser;
      if (user) {
        const projectRef = doc(db, "projects", projectId);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          if (projectData.contributors.includes(user.uid)) {
            const updatedCategories = {
              ...projectData.categories,
              [sectionName]: projectData.categories[sectionName].map((t) =>
                t.id === task.id ? { ...t, ...editedTask } : t
              )
            };
            await updateDoc(projectRef, { categories: updatedCategories });
            setIsEditing(false);
            fetchProjects(user.uid); // Refresh projects after editing task
          } else {
            alert("You do not have permission to edit this task.");
          }
        }
      }
    } else {
      alert('You do not have permission to save changes to this task.');
    }
  };

  const handleDelete = async () => {
    if (await checkPermissions('canDeleteTasks')) {
      const user = auth.currentUser;
      if (user) {
        const projectRef = doc(db, "projects", projectId);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          if (projectData.contributors.includes(user.uid)) {
            const updatedCategories = {
              ...projectData.categories,
              [sectionName]: projectData.categories[sectionName].filter((t) => t.id !== task.id)
            };
            await updateDoc(projectRef, { categories: updatedCategories });
            fetchProjects(user.uid); // Refresh projects after deleting task
          } else {
            alert("You do not have permission to delete this task.");
          }
        }
      } else {
        console.error("User is not authenticated");
      }
    } else {
      alert('You do not have permission to delete tasks.');
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const modal = (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={() => setIsEditing(false)}>&times;</span>
        <h2>Edit Task</h2>
        <input
          type="text"
          className="task-title-input"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
        />
        <input
          type="date"
          className="due-date-input"
          value={editedTask.dueDate}
          onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
        />
        <select
          className="priority-select"
          value={editedTask.priority}
          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <textarea
          className="task-description-input"
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
        />
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );

  return (
    <>
      <li className={`task-card priority-${task.priority} ${completed ? 'completed' : ''}`}>
        <div className="task-header">
          <div className="completion-status">
            <input type="checkbox" checked={completed} onChange={handleCheckboxChange} />
          </div>
          <h4 className="task-title">
            {task.title}
            <span className={`priority-indicator priority-${task.priority}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </h4>
          <span className="due-date">Due: {task.dueDate}</span>
          <button className="task-options-btn2" onClick={toggleOptions}>⋮</button>
          {showOptions && (
            <div className="options-menu" ref={optionsRef}>
              <div className="option" onClick={handleEdit}>Edit</div>
              <div className="option delete-option" onClick={handleDelete}>Delete</div>
            </div>
          )}
        </div>
        <p className="task-description">{task.description}</p>
      </li>
      {isEditing && ReactDOM.createPortal(modal, document.body)}
    </>
  );
};

export default TaskCard;