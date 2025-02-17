import React from 'react'

const Home = () => {
    const workouts = [
      { id: 1, name: 'Squats', description: 'Perfect for leg day' },
      { id: 2, name: 'Push-ups', description: 'Build upper body strength' },
      { id: 3, name: 'Crunches', description: 'Core strengthening exercise' }
    ];
  
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to FLEX-IT-OUT</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
              <p className="text-gray-600 mb-4">{workout.description}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Start Workout
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Home