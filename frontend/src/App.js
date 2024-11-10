import './styles/global.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Homepage from './pages/Homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="register" element={<Register />} />
          <Route path="homepage" element={<Homepage />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
