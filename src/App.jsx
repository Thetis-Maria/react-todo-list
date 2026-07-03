// Import routing components from React Router:
// - BrowserRouter (renamed to Router): enables client-side routing for the whole app
// - Routes: container that holds all route definitions
// - Route: maps a URL path to a specific component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import ToDoList from "./Components/ToDoList";

function App() {
  return (
    //Router must wrap everything that uses routing features
    <Router>
      {/* Routes looks at the current URL and renders
          the first Route whose path matches it */}

      <Routes>
        {/* Root path — show the Login page by default */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/todo" element={<ToDoList />} />
      </Routes>
    </Router>
  );
}

export default App;
