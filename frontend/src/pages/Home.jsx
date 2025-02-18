import React from 'react'

const Home = ({ darkMode }) => {
  const workouts = [
    { id: 1, name: 'Squats', description: 'Perfect for leg day' },
    { id: 2, name: 'Push-ups', description: 'Build upper body strength' },
    { id: 3, name: 'Crunches', description: 'Core strengthening exercise' }
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className={`text-3xl font-bold mb-8 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Welcome to FLEX-IT-OUT
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className={`rounded-xl shadow-lg p-6 transition-colors duration-200 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {workout.name}
            </h3>
            <p className={`mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {workout.description}
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
              Start Workout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home