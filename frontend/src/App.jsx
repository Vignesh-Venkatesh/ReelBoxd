// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";

import Films from "./pages/Films";
import Profile from "./pages/Profile";
import Movie from "./pages/Movie";
import UserWatched from "./components/profile/UserWatched";

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

          {/* Movie Routes */}
          <Route
            path="/movie/:tmdb_id"
            element={
              <ProtectedRoute>
                <Movie />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/:username/watched"
            element={
              <ProtectedRoute>
                <UserWatched />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/:username"
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
