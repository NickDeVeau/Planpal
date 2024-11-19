import React from 'react';
import './rightsidebar.css';

const RightSidebar = ({ isRightSidebarExpanded, toggleRightSidebarExpand }) => {
    return (
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
    );
};

export default RightSidebar;
