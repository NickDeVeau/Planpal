import React, { useState, useEffect, useRef } from "react";
import "./eventCard.css";

const EventCard = ({ event }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li className={`event-card priority-${event.priority}`}>
      <div className="event-header">
        <h4 className="event-title">
          {event.title}
          <span className={`priority-indicator priority-${event.priority}`}>
            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
          </span>
        </h4>
        <span className="event-date">{event.date}</span>
        <button className="options-btn" onClick={toggleOptions}>⋮</button>
        {showOptions && (
          <div className="options-menu" ref={optionsRef}>
            <div className="option">Edit</div>
            <div className="option delete-option">Delete</div>
          </div>
        )}
      </div>
    </li>
  );
};

export default EventCard;