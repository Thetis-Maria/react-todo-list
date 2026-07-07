import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ToDoList.css";

function ToDoList() {
  const navigate = useNavigate();

  //Read the session written by Login, if nobody is logged in null
  const savedUser = localStorage.getItem("currentUser");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  //Load this user's tasks once
  // tasksByUser maps each user's email to their task list
  const [tasks, setTasks] = useState(() => {
    if (!currentUser) return [];

    const saved = localStorage.getItem("tasksByUser");
    const tasksByUser = saved ? JSON.parse(saved) : {};

    const userTasks = tasksByUser[currentUser.email] || [];

    //Restore createdAt to a Date object because JSON stores it as a string
    return userTasks.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }));
  });

  //Route protection: redirect to login if nobody is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState("");

  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  //Save tasks on every change: read the shared map, update only thiw user's entry, write it back
  useEffect(() => {
    if (!currentUser) return;

    const saved = localStorage.getItem("tasksByUser");
    const tasksByUser = saved ? JSON.parse(saved) : {};

    tasksByUser[currentUser.email] = tasks;

    localStorage.setItem("tasksByUser", JSON.stringify(tasksByUser));
  }, [tasks, currentUser]);

  function handleTitleChange(event) {
    setNewTitle(event.target.value);
    if (error) setError("");
  }

  function handleDescriptionChange(event) {
    setNewDescription(event.target.value);
  }

  //Logout: remove only the session
  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/");
  }

  function addTask() {
    if (newTitle.trim() === "") {
      setError("Task title is required.");
      return;
    }
    setError("");

    const newTask = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      completed: false,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);

    setNewTitle("");
    setNewDescription("");
  }

  function toggleTaskCompletion(id) {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  /*The checkbox button toggles the completed status of the task when
    clicked, displaying a checked or unchecked box based on the task's
    completed property*/
  function renderTask(task) {
    return (
      <li key={task.id}>
        <button
          onClick={() => toggleTaskCompletion(task.id)}
          className={`checkbox-button ${task.completed ? "completed" : "pending"}`}
        >
          {" "}
        </button>
        <span className="task-text">{task.title}</span>
        <span className="task-description">{task.description}</span>
        <button className="remove-button" onClick={() => removeTask(task.id)}>
          Remove
        </button>
      </li>
    );
  }

  //Sorts tasks by creation date (newest first) and separates them into completed and pending tasks
  const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  const completedTasks = sortedTasks.filter((t) => t.completed);
  const pendingTasks = sortedTasks.filter((t) => !t.completed);

  //Render nothing while there is no user
  if (!currentUser) {
    return null;
  }

  return (
    <>
      <h1>Welcome, {currentUser.username}!</h1>
      <div className="todo-list">
        <h2>Today's Tasks</h2>
        <div className="date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
        <div className="input-row">
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Enter a new task title..."
          />
          <input
            type="text"
            value={newDescription}
            onChange={handleDescriptionChange}
            placeholder="Enter a new task description..."
          />
          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        <h3
          className="task-section-title"
          onClick={() => setShowPending(!showPending)}
        >
          {showPending ? "▼" : "▶"} Pending ({pendingTasks.length})
        </h3>
        {showPending &&
          (pendingTasks.length > 0 ? (
            <ol>{pendingTasks.map(renderTask)}</ol>
          ) : (
            <p>No pending tasks.</p>
          ))}
        <h3
          className="task-section-title"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? "▼" : "▶"} Completed ({completedTasks.length})
        </h3>
        {showCompleted &&
          (completedTasks.length > 0 ? (
            <ol>{completedTasks.map(renderTask)}</ol>
          ) : (
            <p>No completed tasks.</p>
          ))}
        <button
          className="clear-completed-button"
          onClick={() => setTasks(pendingTasks)}
        >
          Clear Completed Tasks
        </button>
      </div>
      <div>
        <button className="logout-button" onClick={() => handleLogout()}>
          Logout
        </button>
      </div>
    </>
  );
}

export default ToDoList;
