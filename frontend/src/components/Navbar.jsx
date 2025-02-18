import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

const Navbar = ({ isAuthenticated,setIsAuthenticated }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.logout();
      setIsAuthenticated(false);
      navigate('/login'); 
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

    return (
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/home')} className="text-white text-xl font-bold">FLEX-IT-OUT</button>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate('/home')} className="text-white hover:text-blue-200">Home</button>
                <button onClick={() => navigate('/profile')} className="text-white hover:text-blue-200">Profile</button>
                <button onClick={() => navigate('/leaderboard')} className="text-white hover:text-blue-200">Leaderboard</button>
                <button onClick={() => navigate('/challenges')} className="text-white hover:text-blue-200">Challenges</button>
                <button onClick={handleLogout} className="text-white hover:text-blue-200">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-white hover:text-blue-200">Login</button>
                <button onClick={() => navigate('/signup')} className="text-white hover:text-blue-200">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  };

export default Navbar