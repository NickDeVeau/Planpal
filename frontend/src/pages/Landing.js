import React from 'react';
import '../styles/landing.css';
import Navbar from '../components/Navbar';

const Landing = () => {
    return (
        <div>
            <Navbar/>
            <div className='large-message'>JOIN PLANPAL NOW</div>
        </div>
    );
};

export default Landing;
