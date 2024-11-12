import React from 'react';
import Navbar from '../../components/Navbar/Navbar.js';
import './login.css';

const Login = () => {
    return (
        <div>
            <Navbar />
            <div className="auth-container">
                <form className="login-form">
                    <h2>Login</h2>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Password" required />
                    </div>
                    <button type="submit" className="login-button">Sign In</button>
                    <div className="auth-links">
                        <a href="/forgot-password">Forgot password?</a>
                        <a href="/register">Create an account</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
