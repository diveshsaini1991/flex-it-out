import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api.js';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ 
  isAuthenticated, 
  setIsAuthenticated, 
  darkMode, 
  toggleDarkMode 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (!navbar) return;
    
    navbar.style.transition = 'transform 0.3s ease';
    
    if (location.pathname !== '/') {
      navbar.style.transform = 'translateY(0)';
      return;
    }
  }, [location.pathname]);

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-200
      ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
      border-b
    `}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <button 
            onClick={() => navigate('/home')} 
            className={`text-xl font-bold
              ${darkMode ? 'text-white' : 'text-gray-900'}
            `}
          >
            FLEX-IT-OUT
          </button>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
              <NavLink darkMode={darkMode} onClick={() => navigate('/')}>
                  Home
                </NavLink>
                <NavLink darkMode={darkMode} onClick={() => navigate('/exercises')}>
                  Exercises
                </NavLink>
                <NavLink darkMode={darkMode} onClick={() => navigate('/profile')}>
                  Profile
                </NavLink>
                <NavLink darkMode={darkMode} onClick={() => navigate('/leaderboard')}>
                  Leaderboard
                </NavLink>
                <NavLink darkMode={darkMode} onClick={() => navigate('/challenges')}>
                  Challenges
                </NavLink>
                <NavLink darkMode={darkMode} onClick={handleLogout}>
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink darkMode={darkMode} onClick={() => navigate('/login')}>
                  Login
                </NavLink>
                <NavLink darkMode={darkMode} onClick={() => navigate('/signup')}>
                  Sign Up
                </NavLink>
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200
                ${darkMode 
                  ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ darkMode, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
      ${darkMode 
        ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}
    `}
  >
    {children}
  </button>
);

export default Navbar;