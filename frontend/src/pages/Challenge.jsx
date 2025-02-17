import React, { useEffect, useState } from 'react'
import { api } from '../services/api.js';

const Challenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await api.getChallenges();
        setChallenges(data);
      } catch (err) {
        console.error('Failed to fetch challenges:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const handleJoinChallenge = async (challengeId) => {
    try {
      await api.joinChallenge(challengeId);
      const data = await api.getChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to join challenge:', err);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Active Challenges</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge._id} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>{challenge.participants.length} participants</span>
              <span>
                {Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
              </span>
            </div>
            <button 
              onClick={() => handleJoinChallenge(challenge._id)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={challenge.participants.includes(localStorage.getItem('userId'))}
            >
              {challenge.participants.includes(localStorage.getItem('userId')) ? 'Joined' : 'Join Challenge'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenge