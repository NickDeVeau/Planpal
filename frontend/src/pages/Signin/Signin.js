import React from 'react';
import { useNavigate } from 'react-router-dom';
import './siginin.css';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Temporarily navigate to the Dashboard page
        navigate('/dashboard');
    };

    return (
        <div>
            <div className="auth-container">
                <form className="login-form" onSubmit={handleSubmit}>
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