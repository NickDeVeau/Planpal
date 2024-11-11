import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar__container" id="navbar" data-testid="navbar">
        </nav>
    );
};

export default Navbar;
