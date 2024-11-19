import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './navbar.css';
import '../../global.css';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar" id="navbar" data-testid="navbar">
            <Link to="/signin">
                <button className="signin-button">Sign In</button>
            </Link>
        </nav>
    );
};

export default Navbar;
