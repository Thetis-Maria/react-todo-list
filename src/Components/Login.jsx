import { useNavigate } from "react-router-dom";
import "./Auth.css";
import React, { useState } from "react";

function Login() {
  const [users, setUsers] = useState([
    {
      email: "thetis",
      password: "111",
    },
    {
      email: "tasos",
      password: "222",
    },
  ]);

  //Controlled input states: they hold whatever the user types
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  //Feedback messages shown to the user
  const [error, setError] = useState(""); //validation/login errors
  const [success, setSuccess] = useState(""); //success message

  //Hook that lets us navigate to another route
  const navigate = useNavigate();

  //Updates the email state on evry keystroke in the email input
  function handleEmailChange(event) {
    setNewEmail(event.target.value);
  }

  //Updates the password state on every keystroke in the password input
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
    //Clear any previous error once validation passes
    setError("");

    // Authentication

    // Search the users array for a user whose both email and password match the entered credentials
    //Returns the user object if found, otherwise undefined
    const foundUser = users.find(
      (u) => u.email === newEmail && u.password === newPassword,
    );

    if (foundUser) {
      //Credentials are correct
      setError("");
      setSuccess("Account logged in successfully!");

      setTimeout(() => {
        navigate("/todo");
      }, 2000);
    } else {
      ///No matching user found, show error
      setSuccess("");
      setError("Invalid email or password");
    }
  }

  return (
    <div className="login-page">
      {/*Success message shown, only when success is not empty*/}
      {success && <p className="success">{success}</p>}

      {/*Card containing the login form*/}
      <div className="auth-container">
        <div className="login-header">
          <h1 className="login-title">Login</h1>
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

        {/*Error message shown, only when error is not empty*/}
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
          <a href="/signup" className="login-link">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
