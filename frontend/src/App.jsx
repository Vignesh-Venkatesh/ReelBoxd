// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";

import Films from "./pages/Films";
import Profile from "./pages/Profile";

function App() {
  useEffect(() => {
    // set default theme on app load
    document.documentElement.setAttribute("data-theme", "night");
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/films"
            element={
              <ProtectedRoute>
                <Films />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
