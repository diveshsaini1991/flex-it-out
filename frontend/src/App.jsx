import { useState } from 'react'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import Challenge from './pages/Challenge.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!isAuthenticated && currentPage !== 'signup') {
      return <Login setIsAuthenticated={setIsAuthenticated} setCurrentPage={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'signup':
        return <Signup setIsAuthenticated={setIsAuthenticated} setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <Profile />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'challenges':
        return <Challenge />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        setCurrentPage={setCurrentPage}
      />
      {renderPage()}
    </div>
  );
};

export default App
