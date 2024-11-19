import React from 'react';
import './sidebar.css';

const Sidebar = () => {
    return (
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
    );
};

export default Sidebar;
