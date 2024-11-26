import React from "react";
import "./landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src="/assets/images/logo.svg" alt="PlanPal Logo" className="logo" />
        <nav>
          <a href="/signin">Sign In</a>
          <a href="/register" className="cta-button">Get Started</a>
        </nav>
      </header>

      <main className="landing-main">
        <h1>Welcome to PlanPal</h1>
        <p>Effortlessly manage your tasks and collaborate in real-time.</p>
        <a href="/register" className="cta-button">Start Your Journey</a>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2024 PlanPal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
