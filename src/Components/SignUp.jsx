import { useNavigate } from "react-router-dom";
import "./Auth.css";
import React, { useState } from "react";

function SignUp() {
  const [users, setUsers] = useState([
    {
      username: "thetis",
      email: "thetis",
      password: "111",
    },
    {
      email: "tasos",
      password: "222",
    },
  ]);

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

    if (foundUser) {
      //Return and error show when user already exists
      setError("User already exists. Please login.");
      return;
    } else {
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

      //All checks passed- account is created
      setError("");
      const newUser = {
        username: newUsername,
        email: newEmail,
        password: newPassword,
      };

      //Success message
      setSuccess("Account created successfully! Redirecting to login...");
      setUsers([...users, newUser]);

      //After 2 sec navigate to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    //Clear the input fields
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
  }

  return (
    <div className="auth-page">
      {/*Success message*/}
      {success && <p className="success">{success}</p>}

      {/*Card containing the sign up form*/}
      <div className="auth-container">
        <div className="signup-header">
          <h1 className="signup-title">Sign Up</h1>
        </div>

        {/*Username input */}
        <div className="input-group">
          <input
            type="username"
            placeholder="Username"
            value={newUsername}
            onChange={handleUsernameChange}
          />
        </div>

        {/*Email input */}
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={handleEmailChange}
          />
        </div>

        {/*Password input */}
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={handlePasswordChange}
          />
        </div>

        {/*Error message */}
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
          <a href="/login" className="signup-link">
            Already have an account? Log in{" "}
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
