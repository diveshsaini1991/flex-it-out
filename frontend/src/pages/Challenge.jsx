import React from 'react'

const Challenge = () => {
    const challenges = [
      {
        id: 1,
        title: '30-Day Squat Challenge',
        description: 'Complete 100 squats every day for 30 days',
        participants: 245,
        daysLeft: 15
      },
      {
        id: 2,
        title: 'Push-up Master',
        description: 'Achieve 50 perfect push-ups in one set',
        participants: 189,
        daysLeft: 7
      },
      {
        id: 3,
        title: 'Core Champion',
        description: 'Complete 1000 crunches in a week',
        participants: 156,
        daysLeft: 20
      }
    ];
  
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Active Challenges</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>{challenge.participants} participants</span>
                <span>{challenge.daysLeft} days left</span>
              </div>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Challenge