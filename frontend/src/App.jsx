import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Challenge from "./pages/Challenge.jsx";
import Squat from "./pages/squat.jsx";  
import Landing from "./pages/Landing.jsx"; 
import Crunches from "./pages/Crunches.jsx";
import Pushups from "./pages/Pushups.jsx"; 
import Blogs from "./pages/Blog.jsx";
import BlogDetail from "./pages/Blogdetail.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <Navbar 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Landing isAuthenticated={isAuthenticated} darkMode={darkMode} />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} darkMode={darkMode} />} />
            <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} darkMode={darkMode} />} />
            
            {isAuthenticated ? (
              <>
                <Route path="/profile" element={<Profile darkMode={darkMode} />} />
                <Route path="/leaderboard" element={<Leaderboard darkMode={darkMode} />} />
                <Route path="/challenges" element={<Challenge darkMode={darkMode} />} />
                <Route path="/exercises" element={<Home darkMode={darkMode} />} />
                <Route path="/squat" element={<Squat darkMode={darkMode} />} />
                <Route path="/crunches" element={<Crunches darkMode={darkMode} />} /> 
                <Route path="/pushups" element={<Pushups darkMode={darkMode} />} /> 
                <Route path="/blogs" element={<Blogs darkMode={darkMode} />} />
                <Route path="/blogs/:id" element={<BlogDetail darkMode={darkMode} />} />
                <Route path="/create-blog" element={<CreateBlog darkMode={darkMode} />} />
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