import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../firebase"; // Import Firestore
import "./register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        projects: [], // Initialize projects array
        tasks: [], // Initialize tasks array
        events: [], // Initialize events array
        profilePicture: null // Initialize profilePicture field
      });

      setShowSuccessModal(true); // Show success modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h1 id="register-title" data-testid="register-title">Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          id="register-email"
          data-testid="register-email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          id="register-password"
          data-testid="register-password"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/signin">Sign in here</a>.
      </p>
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowSuccessModal(false)}>&times;</span>
            <h2>Registration Successful!</h2>
            <p>A verification email has been sent to your email address. Please check your inbox to verify your account.</p>
            <button onClick={() => window.location.href = "/signin"}>Go to Sign In</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
