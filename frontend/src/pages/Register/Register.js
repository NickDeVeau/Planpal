import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
            <p>Your account has been created successfully.</p>
            <button onClick={() => window.location.href = "/signin"}>Go to Sign In</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
