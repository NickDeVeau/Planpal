import React, { useState, useEffect, useRef } from "react";
import "./taskCard.css";

const TaskCard = ({ task }) => {
  const [showOptions, setShowOptions] = useState(false);
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

  const handleCheckboxChange = () => {
    setCompleted(!completed);
    // Optionally, you can add code to update the state or make an API call here
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
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
        <button className="options-btn" onClick={toggleOptions}>⋮</button>
        {showOptions && (
          <div className="options-menu" ref={optionsRef}>
            <div className="option">Edit</div>
            <div className="option delete-option">Delete</div>
          </div>
        )}
      </div>
      <p className="task-description">{task.description}</p>
    </li>
  );
};

export default TaskCard;