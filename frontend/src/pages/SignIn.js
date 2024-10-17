import React from 'react';
import '../styles/signin.css';
import Navbar from '../components/Navbar';

const SignIn = () => {
    return (
        <div className='page-layout'>
            <Navbar/>
            <div className='signin-form-container' id='signin'>
                <div className='label'>Email</div>
                <div className='input-field'><div className='input-field-text'>Value</div></div>
                <div className='label'>Password</div>
                <div className='input-field'><div className='input-field-text'>Value</div></div>
            </div>
        </div>
    );
};

export default SignIn;
