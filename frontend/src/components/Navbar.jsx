import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api.js';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({
  isAuthenticated,
  setIsAuthenticated,
  darkMode,
  toggleDarkMode,
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
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-200
        ${darkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200'
        }
        border-b shadow-sm
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
      onClick={() => navigate('/home')}
      className={`
        text-3xl font-bold
        ${darkMode ? 'text-white' : 'text-gray-900'}
        hover:opacity-80 transition-opacity duration-200
      `}
      style={{ fontFamily: "'Roboto', sans-serif" }} // Apply custom font
    >
      FLEX-IT-OUT
    </button>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4 ">
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

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300
                ${darkMode
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-yellow-300 hover:scale-110'
                  : 'bg-gradient-to-r from-blue-100 to-purple-100 text-gray-600 hover:scale-110'
                }
                shadow-md hover:shadow-lg
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
    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
      ${darkMode
        ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r from-gray-700 to-gray-800 hover:scale-105'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r from-blue-100 to-purple-100 hover:scale-105'
      }
      shadow-sm hover:shadow-md
    `}
  >
    {children}
  </button>
);

export default Navbar;