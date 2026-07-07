import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import React, { useState } from "react";

function Login() {
  //Load registered users, same users key that SignUp writes to
  const [users] = useState(() => {
    const saved = localStorage.getItem("users");
    const users = saved ? JSON.parse(saved) : [];
    return users;
  });

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  //Feedback messages shown to the user
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  //Updates the email state on every keystroke in the email input
  function handleEmailChange(event) {
    setNewEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setNewPassword(event.target.value);
  }

  //Runs when the Login button is clicked
  function handleLogin() {
    //Validation
    // Return and show error if the field is empty
    if (newEmail.trim() === "") {
      setError("Please enter an email.");
      return;
    }
    if (newPassword.trim() === "") {
      setError("Please enter a password.");
      return;
    }
    setError("");

    // Authentication

    // Search the users array for a user whose both email and password match the entered credentials
    //Returns the user object if found, otherwise undefined
    const foundUser = users.find(
      (u) => u.email === newEmail && u.password === newPassword,
    );

    if (foundUser) {
      setError("");
      setSuccess("Account logged in successfully!");

      //Save the session: ToDoList reads this to know who is logged in
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          username: foundUser.username,
          email: foundUser.email,
        }),
      );

      setTimeout(() => {
        navigate("/todo");
      }, 2000);
    } else {
      setSuccess("");
      setError("Invalid email or password");
    }
  }

  return (
    <div className="auth-page">
      {success && <p className="success">{success}</p>}

      {/*Card containing the login form*/}
      <div className="auth-container">
        <div className="login-header">
          <h2 className="login-title">Login</h2>
        </div>

        {/* Credentials inputs */}
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

        {/*Login button, triggers validation & authentication */}
        <button
          type="submit"
          className="auth-button"
          onClick={() => handleLogin()}
        >
          Login
        </button>

        {/* Link to the sign up page for users without an account*/}
        <div className="login-footer">
          <Link to="/signup" className="login-link">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
