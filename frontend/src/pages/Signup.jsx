import React, { useState } from 'react'
import { api } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setIsAuthenticated ,darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await api.signup(
        formData.name,
        formData.email,
        formData.password
      );
      
      setIsAuthenticated(true);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-200`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg
        ${darkMode ? 'bg-gray-800' : 'bg-white'} 
        transition-colors duration-200`}>
        <h2 className={`text-3xl font-bold text-center
          ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Create Account
        </h2>
        
        {error && (
          <div className={`border-l-4 border-red-500 p-4 mb-4
            ${darkMode ? 'bg-red-900' : 'bg-red-50'}`}>
            <p className={`${darkMode ? 'text-red-200' : 'text-red-700'}`}>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {/* Input fields with similar styling as Login component */}
            {['name', 'email', 'password', 'confirmPassword'].map((field) => (
              <input
                key={field}
                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                required
                className={`w-full px-3 py-2 border rounded-md
                  ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-colors duration-200`}
                placeholder={field.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
              text-white rounded-md transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;