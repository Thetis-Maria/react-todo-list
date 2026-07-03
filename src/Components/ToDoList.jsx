import React, { useState } from "react";
import "./ToDoList.css";

function ToDoList() {
  //Main state: the array of task obejects
  // Each task has: id (unique), title, description,
  // completed (boolean) and createdAt (Date, used for sorting).
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Example Task 1",
      description: "Task 1 Description",
      completed: false,
      createdAt: new Date("2026-07-01T10:00:00"),
    },
    {
      id: 2,
      title: "Example Task 2",
      description: "Task 2 Description",
      completed: true,
      createdAt: new Date("2026-07-01T12:00:00"),
    },
  ]);

  //Controlled input states for new task title and description, and error message
  //Error message shown when the user tries to add a task without a title
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState("");

  //Runs on every change in the title input field, updates the newTitle state and clears any error message
  function handleTitleChange(event) {
    setNewTitle(event.target.value);
    if (error) setError("");
  }

  //Runs on every change in the description input field, updates the newDescription state
  function handleDescriptionChange(event) {
    setNewDescription(event.target.value);
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

  return (
    <>
      <div className="todo-list">
        <h1>Today's Tasks</h1>
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
        <h2 className="task-section-title">Pending ({pendingTasks.length})</h2>
        {pendingTasks.length > 0 ? (
          <ol>{pendingTasks.map(renderTask)}</ol>
        ) : (
          <p>No pending tasks.</p>
        )}
        <h2 className="task-section-title">
          Completed ({completedTasks.length})
        </h2>
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
        <button
          className="logout-button"
          onClick={() => (window.location.href = "/")}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default ToDoList;
