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

  //Controlled input states for new task title and description, and error message
  //Error message shown when the user tries to add a task without a title
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState("");


  //Save tasks on every change: read the shared map, update only thiw user's entry, write it back 
  useEffect(() => {
    if (!currentUser) return;

    const saved = localStorage.getItem("tasksByUser");
    const tasksByUser = saved ? JSON.parse(saved) : {};

    tasksByUser[currentUser.email] = tasks;

    localStorage.setItem("tasksByUser", JSON.stringify(tasksByUser));
  }, [tasks, currentUser]);

  //Runs on every change in the title input field, updates the newTitle state and clears any error message
  function handleTitleChange(event) {
    setNewTitle(event.target.value);
    if (error) setError("");
  }

  //Runs on every change in the description input field, updates the newDescription state
  function handleDescriptionChange(event) {
    setNewDescription(event.target.value);
  }

  //Logout: remove only the session
  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/");
  }

  //Adds a new task to the tasks array if the title is not empty, otherwise sets an error message
  function addTask() {
    if (newTitle.trim() === "") {
      setError("Task title is required");
      return;
    }
    setError("");

    //Creates a new task object with a unique id, title, description, completed status, and creation date
    const newTask = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      completed: false,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    //Clears the input fields after adding the task
    setNewTitle("");
    setNewDescription("");
  }

  //Toggles the completed status of a task by its id
  function ToggleTaskCompletion(id) {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  //Removes a task : filter keeps only the tasks that do not match the given id
  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  //Renders a single task as a list item with a checkbox button, title, description, and remove button
  //Defined once and used for both pending and completed tasks
  /*The checkbox button toggles the completed status of the task when
    clicked, displaying a checked or unchecked box based on the task's
    completed property*/
  function renderTask(task) {
    return (
      <li key={task.id}>
        <button
          onClick={() => ToggleTaskCompletion(task.id)}
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

  //Filters the sorted tasks into two arrays: completedTasks and pendingTasks
  const completedTasks = sortedTasks.filter((t) => t.completed);
  const pendingTasks = sortedTasks.filter((t) => !t.completed);

  //Render nothing while there is no user
  if (!currentUser) {
    return null;
  }

  return (
    <>
      <h1>Welcome {currentUser.username}!</h1>
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
          {/* Controlled input: value comes from state, onChange writes every
        keystroke back into state */}
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
        {/* Conditional rendering: if error is not empty, display the error message
        in a paragraph with class "error" */}
        {error && <p className="error">{error}</p>}
        <h3 className="task-section-title">Pending ({pendingTasks.length})</h3>
        {pendingTasks.length > 0 ? (
          <ol>{pendingTasks.map(renderTask)}</ol>
        ) : (
          <p>No pending tasks.</p>
        )}
        <h3 className="task-section-title">
          Completed ({completedTasks.length})
        </h3>
        {completedTasks.length > 0 ? (
          <ol>{completedTasks.map(renderTask)}</ol>
        ) : (
          <p>No completed tasks.</p>
        )}
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
