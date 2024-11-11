import React from 'react';
import './landing.css';
import Navbar from '../../components/Navbar/Navbar.js';

const Landing = () => {
    return (
        <div>
            <Navbar/>
            <div className='large-message'>JOIN PLANPAL NOW</div>
        </div>
    );
};

export default Landing;
