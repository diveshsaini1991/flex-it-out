import React, { useEffect, useState } from 'react';
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
    <div className={`flex items-center justify-center min-h-screen ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="text-2xl font-semibold">Loading...</div>
    </div>
  );

  if (!profile) return (
    <div className={`flex items-center justify-center min-h-screen ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="text-2xl font-semibold">Failed to load profile</div>
    </div>
  );

  return (
    <div className={`min-h-screen p-8 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl shadow-lg p-8 transition-all duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className={`w-32 h-32 mx-auto rounded-full mb-4 bg-gradient-to-r ${
              darkMode ? 'from-blue-600 to-purple-600' : 'from-blue-400 to-purple-400'
            }`}></div>
            <h2 className={`text-3xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {profile.name}
            </h2>
            <p className={`text-lg ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {profile.email}
            </p>
          </div>

          {/* Statistics and Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistics Card */}
            <div className={`p-6 rounded-lg transition-all duration-300 hover:scale-105 ${
              darkMode ? 'bg-gradient-to-r from-blue-900 to-blue-700' : 'bg-gradient-to-r from-blue-50 to-blue-100'
            }`}>
              <h3 className={`text-2xl font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Statistics
              </h3>
              <div className="space-y-2">
                <p className={`text-lg ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Total Workouts: <span className="font-bold text-blue-500">{profile.totalWorkouts}</span>
                </p>
                <p className={`text-lg ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Completed Goals: <span className="font-bold text-green-500">{profile.completedGoals}</span>
                </p>
              </div>
            </div>

            {/* Achievements Card */}
            <div className={`p-6 rounded-lg transition-all duration-300 hover:scale-105 ${
              darkMode ? 'bg-gradient-to-r from-green-900 to-green-700' : 'bg-gradient-to-r from-green-50 to-green-100'
            }`}>
              <h3 className={`text-2xl font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Achievements
              </h3>
              <ul className={`list-disc pl-4 space-y-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {profile.achievements.map((achievement, index) => (
                  <li key={index} className="text-lg">{achievement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Info */}
          <div className={`mt-8 p-6 rounded-lg transition-all duration-300 hover:scale-105 ${
            darkMode ? 'bg-gradient-to-r from-purple-900 to-purple-700' : 'bg-gradient-to-r from-purple-50 to-purple-100'
          }`}>
            <h3 className={`text-2xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Additional Info
            </h3>
            <div className="space-y-2">
              <p className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Member Since: <span className="font-bold text-purple-500">{profile.memberSince}</span>
              </p>
              <p className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Last Active: <span className="font-bold text-purple-500">{profile.lastActive}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;