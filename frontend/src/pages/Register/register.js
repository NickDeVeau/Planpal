import React from 'react';
import Navbar from '../../components/Navbar/Navbar.js';
import './register.css';

const Register = () => {
    return (
        <div>
            <Navbar />
            <div className="auth-container">
                <form className="register-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Password" required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Confirm Password" required />
                    </div>
                    <button type="submit" className="register-button">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
