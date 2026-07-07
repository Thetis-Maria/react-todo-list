import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import React, { useState } from "react";

function SignUp() {
  //Load registered users from localStorage or empty list on first visit
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    const users = saved ? JSON.parse(saved) : [];
    return users;
  });

  //Controlled input states, hold whatever the user types
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  //Feedback messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  //Update state on every keystroke (one per input)
  function handleUsernameChange(event) {
    setNewUsername(event.target.value);
  }

  function handleEmailChange(event) {
    setNewEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setNewPassword(event.target.value);
  }

  //Runs when the Sign Up button is clicked
  function handleSignUp() {
    //Duplicate check: Look for an existing user with the same email
    const foundUser = users.find((u) => u.email === newEmail);

    //Validation checks and return on the first failure

    //Username must not be empty
    if (newUsername.trim() === "") {
      setError("Username is required.");
      return;
    }

    //Email must not be empty and it must match the basic pattern example@example.example
    if (newEmail.trim() === "") {
      setError("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    //Password must be at least 8 characters long, have no whitespaces and contain both letters and numbers
    if (newPassword.trim().length < 8) {
      setError("Password has to contain at least 8 characters.");
      return;
    }
    if (/\s/.test(newPassword.trim())) {
      setError("Password must not contain whitespaces.");
      return;
    }
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError("Password must contain both letters and numbers.");
      return;
    }

    if (foundUser) {
      setError("User already exists. Please login.");
      return;
    }

    setError("");
    const newUser = {
      username: newUsername,
      email: newEmail,
      password: newPassword,
    };

    //Save the full updated list back to localStorage
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    setSuccess("Account created successfully! Redirecting to login...");

    setNewUsername("");
    setNewEmail("");
    setNewPassword("");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  return (
    <div className="auth-page">
      {success && <p className="success">{success}</p>}

      {/*Card containing the sign up form*/}
      <div className="auth-container">
        <div className="signup-header">
          <h2 className="signup-title">Sign Up</h2>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={handleUsernameChange}
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={handleEmailChange}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={handlePasswordChange}
          />
        </div>

        {error && <p className="error">{error}</p>}

        {/*Sign Up button, triggers validation and account creation */}
        <button
          type="button"
          className="auth-button"
          onClick={() => handleSignUp()}
        >
          Sign Up
        </button>

        {/*Link to the login page for existing users */}
        <div className="signup-footer">
          <Link to="/login" className="signup-link">
            Already have an account? Log in{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
