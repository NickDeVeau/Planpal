import React, { useState } from 'react';  
import { useLocation, Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const location = useLocation();

    return (
        <nav className="navbar" id='navbar'>
            <Link to="/" className="title" id='title' data-testid='title'>Planpal</Link>
            <div className="nav-buttons-container" id='navbar-button-container'>
                {loggedIn ? (

                    <>
                        <Link to="/homepage" className="nav-button" id='home-button'>Home</Link>
                        <button onClick={() => setLoggedIn(false)} className="nav-button" id='logout-button'>Logout</button>
                    </>
                ) : (
 
                    <>
                        {location.pathname === '/' && (
                            <>
                                <Link to="/signin" className="nav-button" id='signin-button'>Sign In</Link>
                                <Link to="/register" className="nav-button" id='register-button'>Register</Link>
                            </>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
