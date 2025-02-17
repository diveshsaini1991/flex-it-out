import React, { useEffect, useState } from 'react'
import { api } from '../services/api.js';
const Profile = () => {
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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!profile) return <div className="text-center p-8">Failed to load profile</div>;

    return (
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Statistics</h3>
              <p>Total Workouts: {profile.totalWorkouts}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Achievements</h3>
              <ul className="list-disc pl-4">
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