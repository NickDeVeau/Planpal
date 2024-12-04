import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { auth, db } from "../../firebase"; // Import Firestore
import "../../global.css"; // Import global CSS
import "./signin.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (!userData.profilePicture) {
          await updateDoc(doc(db, "users", user.uid), { profilePicture: null });
        }
        console.log("User data:", userData);
      } else {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          projects: [],
          profilePicture: null, // Initialize profilePicture field
          tasks: [], // Initialize tasks array
          events: [] // Initialize events array
        });
      }
      window.location.href = "/dashboard"; // Navigate to Dashboard after success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          projects: [], // Initialize projects array
          tasks: [], // Initialize tasks array
          events: [] // Initialize events array
        });
      }
      window.location.href = "/dashboard"; // Navigate to Dashboard after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
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
        <button type="submit">Sign In</button>
      </form>
      <button className="google-signin-btn" onClick={handleGoogleSignIn}>Sign in with Google</button>
      <p>
        Don't have an account? <a href="/register">Register here</a>.
      </p>
    </div>
  );
};

export default Signin;
