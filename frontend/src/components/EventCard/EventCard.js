import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./eventCard.css";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../firebase"; // Import Firestore

const EventCard = ({ event, projectId, fetchProjects }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({ ...event });
  const optionsRef = useRef(null);
  const [expired, setExpired] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }
    const projectDocRef = doc(db, "projects", projectId);
    const projectSnapshot = await getDoc(projectDocRef);
    const projectData = projectSnapshot.data();
    const updatedEvents = projectData.events.map(e =>
      e.title === event.title ? { ...e, ...editedEvent } : e
    );
    await updateDoc(projectDocRef, { events: updatedEvents });
    setIsEditing(false);
    fetchProjects(); // Refresh projects after editing event
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const projectDocRef = doc(db, "projects", projectId);
      const projectSnapshot = await getDoc(projectDocRef);
      const projectData = projectSnapshot.data();
      const updatedEvents = projectData.events.filter(e => e.title !== event.title);
      await updateDoc(projectDocRef, { events: updatedEvents });
      fetchProjects(); // Refresh projects after deleting event
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date();
      const eventDate = new Date(event.date);
      if (event.duration === "all-day" && now > eventDate) {
        setExpired(true);
      } else if (event.duration === "multiple-days") {
        const endDate = new Date(event.endDate);
        if (now > endDate) {
          setExpired(true);
        }
      } else if (event.duration === "specific-time") {
        if (event.startTime && event.endTime) {
          const startDateTime = new Date(`${event.date}T${event.startTime}`);
          const endDateTime = new Date(`${event.date}T${event.endTime}`);
          if (now > endDateTime) {
            setExpired(true);
          }
        }
      }
    };
    checkExpiration();
  }, [event]);

  const modal = (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={() => setIsEditing(false)}>&times;</span>
        <h2>Edit Event</h2>
        <input
          type="text"
          className="event-title-input"
          value={editedEvent.title}
          onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
        />
        <input
          type="date"
          className="event-date-input"
          value={editedEvent.date}
          onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
        />
        {editedEvent.duration === "multiple-days" && (
          <input
            type="date"
            className="event-end-date-input"
            value={editedEvent.endDate}
            onChange={(e) => setEditedEvent({ ...editedEvent, endDate: e.target.value })}
          />
        )}
        {editedEvent.duration === "specific-time" && (
          <>
            <input
              type="time"
              className="event-start-time-input"
              value={editedEvent.startTime}
              onChange={(e) => setEditedEvent({ ...editedEvent, startTime: e.target.value })}
            />
            <input
              type="time"
              className="event-end-time-input"
              value={editedEvent.endTime}
              onChange={(e) => setEditedEvent({ ...editedEvent, endTime: e.target.value })}
            />
          </>
        )}
        <select
          className="duration-select"
          value={editedEvent.duration}
          onChange={(e) => setEditedEvent({ ...editedEvent, duration: e.target.value })}
        >
          <option value="all-day">All Day</option>
          <option value="multiple-days">Multiple Days</option>
          <option value="specific-time">Specific Time</option>
        </select>
        <textarea
          className="event-description-input"
          value={editedEvent.description}
          onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
        />
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );

  return (
    <>
      <li className={`event-card priority-${event.priority} ${expired ? 'expired' : ''}`}>
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
              <div className="option" onClick={handleEdit}>Edit</div>
              <div className="option delete-option" onClick={handleDelete}>Delete</div>
            </div>
          )}
        </div>
        <p className="event-description">{event.description}</p>
      </li>
      {isEditing && ReactDOM.createPortal(modal, document.body)}
    </>
  );
};

export default EventCard;