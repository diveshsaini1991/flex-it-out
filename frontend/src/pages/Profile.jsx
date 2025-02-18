import React, { useEffect, useState } from 'react'
import { api } from '../services/api.js';
const Profile = ({ darkMode }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className={`text-center p-8 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      Loading...
    </div>
  );
  
  if (!profile) return (
    <div className={`text-center p-8 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      Failed to load profile
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <div className={`max-w-2xl mx-auto rounded-xl shadow-lg p-8 transition-colors duration-200 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mb-8">
          <div className={`w-32 h-32 mx-auto rounded-full mb-4 ${
            darkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`}></div>
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {profile.name}
          </h2>
          <p className={`${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {profile.email}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg transition-colors duration-200 ${
            darkMode ? 'bg-blue-900' : 'bg-blue-50'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Statistics
            </h3>
            <p className={`${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Total Workouts: {profile.totalWorkouts}
            </p>
          </div>
          <div className={`p-6 rounded-lg transition-colors duration-200 ${
            darkMode ? 'bg-green-900' : 'bg-green-50'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Achievements
            </h3>
            <ul className={`list-disc pl-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {profile.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
  

export default Profile