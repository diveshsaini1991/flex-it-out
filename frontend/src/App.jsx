import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Challenge from "./pages/Challenge.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}>
        <Navbar 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <div className="pt-16">
          <Routes>
            <Route 
              path="/login" 
              element={
                <Login 
                  setIsAuthenticated={setIsAuthenticated}
                  darkMode={darkMode} 
                />
              } 
            />
            <Route 
              path="/signup" 
              element={
                <Signup 
                  setIsAuthenticated={setIsAuthenticated}
                  darkMode={darkMode} 
                />
              } 
            />
            
            {isAuthenticated ? (
            <>
              <Route path="/profile" element={<Profile darkMode={darkMode} />} />
              <Route path="/leaderboard" element={<Leaderboard darkMode={darkMode} />} />
              <Route path="/challenges" element={<Challenge darkMode={darkMode} />} />
              <Route path="/home" element={<Home darkMode={darkMode} />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;