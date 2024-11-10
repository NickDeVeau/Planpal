import React, { useState } from 'react';
import '../styles/signin.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        //Add form validation if needed
        if (email && password) {
            // login op
            navigate('/home');
        } else {
            alert('Please enter both email and password');
        }
    };

    return (
        <div className='page-layout'>
            <Navbar />
            <div className='signin-form-container' id='signin'>
                <div className='label'>Email</div>
                <div className='input-field'>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='input-field-text'
                        placeholder="Enter your email"
                    />
                </div>
                <div className='label'>Password</div>
                <div className='input-field'>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='input-field-text'
                        placeholder="Enter your password"
                    />
                </div>
                {/* Login Button */}
                <button onClick={handleLogin} className='login-button'>
                    Login
                </button>
            </div>
        </div>
    );
};

export default SignIn;

