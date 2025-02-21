 


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

const Challenge = ({ darkMode }) => {
  const [challenges, setChallenges] = useState({ new: [], attempted: [], completed: [] });
  const [activeTab, setActiveTab] = useState('new');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await api.getUserChallenges();
        console.log(data);
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
      const data = await api.getUserChallenges();
      setChallenges(data);
    
    } catch (err) {
      console.error('Failed to join challenge:', err);
    }
  };

  const startChallengeWorkout = (challengeType) => {
   
    console.log(challengeType);
  
    switch (challengeType) {
      case 'squat':
        navigate('/squat');
        break;
      case 'crunches':
        navigate('/crunches');
        break;
      case 'pushup':
        navigate('/pushups');
        break;
      default:
        console.error('Unknown challenge type:', challengeType);
    }
  };

  if (loading) return (
    <div className={`flex items-center justify-center h-64 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      <div className="text-2xl font-semibold">Loading challenges...</div>
    </div>
  );

  return (
    <div className={`min-h-screen p-8 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}>
          Fitness Challenges
        </h1>
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'new' 
                ? `border-b-2 border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}` 
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('new')}
          >
            New Challenges
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'attempted' 
                ? `border-b-2 border-yellow-500 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}` 
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('attempted')}
          >
            In Progress
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'completed' 
                ? `border-b-2 border-green-500 ${darkMode ? 'text-green-400' : 'text-green-600'}` 
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
        
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges[activeTab].length === 0 ? (
            <div className={`col-span-3 text-center p-12 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {activeTab === 'new' && "No new challenges available right now. Check back later!"}
              {activeTab === 'attempted' && "You haven't started any challenges yet."}
              {activeTab === 'completed' && "You haven't completed any challenges yet. Keep going!"}
            </div>
          ) : (
            challenges[activeTab].map((challenge) => (
              <div 
                key={challenge._id} 
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`h-2 ${
                  challenge.type === 'squat' ? 'bg-blue-500' :
                  challenge.type === 'crunches' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {challenge.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      challenge.type === 'squat' ? 'bg-blue-100 text-blue-800' :
                      challenge.type === 'crunches' ? 'bg-green-100 text-green-800' : 
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {challenge.type}
                    </span>
                  </div>
                  
                  <p className={`mb-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {challenge.description}
                  </p>
                  
                  <div className={`flex justify-between text-sm mb-6 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span>Target: <strong>{challenge.target}</strong> reps</span>
                    <span>
                      {Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  </div>
                  
                  {activeTab === 'new' && (
                    <button 
                      onClick={() => handleJoinChallenge(challenge._id)}
                      className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    >
                      Accept Challenge
                    </button>
                  )}
                  
                  {activeTab === 'attempted' && (
                    <button 
                      onClick={() => startChallengeWorkout(challenge.type,)}
                      className="w-full px-4 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white transition-colors duration-200"
                    >
                      Continue Challenge
                    </button>
                  )}
                  
                  {activeTab === 'completed' && (
                    <div className={`text-center py-2 rounded-md ${
                      darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                    }`}>
                      Challenge Completed! 🏆
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenge;