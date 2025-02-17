import React, { useState } from 'react'

const Login = ({ setIsAuthenticated, setCurrentPage }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Add login logic here
      console.log('Login submitted:', formData);
      setIsAuthenticated(true);
      setCurrentPage('home');
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900">Login to FLEX-IT-OUT</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Email address"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  };

export default Login