import React from 'react'

const Navbar = ({ isAuthenticated, onLogout, setCurrentPage }) => {
    return (
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="text-white text-xl font-bold">FLEX-IT-OUT</button>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <button onClick={() => setCurrentPage('home')} className="text-white hover:text-blue-200">Home</button>
                <button onClick={() => setCurrentPage('profile')} className="text-white hover:text-blue-200">Profile</button>
                <button onClick={() => setCurrentPage('leaderboard')} className="text-white hover:text-blue-200">Leaderboard</button>
                <button onClick={() => setCurrentPage('challenges')} className="text-white hover:text-blue-200">Challenges</button>
                <button onClick={onLogout} className="text-white hover:text-blue-200">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentPage('login')} className="text-white hover:text-blue-200">Login</button>
                <button onClick={() => setCurrentPage('signup')} className="text-white hover:text-blue-200">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  };

export default Navbar