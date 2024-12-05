import React from "react";
import "../../global.css"; // Import global CSS
import "./landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src="/logo.svg" alt="PlanPal Logo" className="logo" />
        <nav>
          <a href="/signin" id="signin-link" data-testid="signin-link">Sign In</a>
          <a href="/register" className="cta-button" id="header-get-started-button" data-testid="header-get-started-button">Get Started</a>
        </nav>
      </header>

      <main className="landing-main">
        <h1 id="landing-title" data-testid="landing-title">Welcome to PlanPal</h1>
        <p id="landing-description" data-testid="landing-description">Effortlessly manage your tasks and collaborate in real-time.</p>
        <a href="/register" className="cta-button" id="main-get-started-button" data-testid="main-get-started-button">Start Your Journey</a>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2024 PlanPal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
