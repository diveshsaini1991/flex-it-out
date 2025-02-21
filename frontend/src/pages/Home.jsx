// import React from 'react'
// import { useNavigate } from 'react-router-dom';
// const Home = ({ darkMode }) => {
//   const workouts = [
//     { id: 1, name: 'Squats', description: 'Perfect for leg day' },
//     { id: 2, name: 'Push-ups', description: 'Build upper body strength' },
//     { id: 3, name: 'Crunches', description: 'Core strengthening exercise' }
//   ];
//   const navigate = useNavigate();

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className={`text-3xl font-bold mb-8 ${
//         darkMode ? 'text-white' : 'text-gray-900'
//       }`}>
//         Welcome to FLEX-IT-OUT
//       </h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {workouts.map((workout) => (
//           <div key={workout.id} className={`rounded-xl shadow-lg p-6 transition-colors duration-200 ${
//             darkMode ? 'bg-gray-800' : 'bg-white'
//           }`}>
//             <h3 className={`text-xl font-semibold mb-2 ${
//               darkMode ? 'text-white' : 'text-gray-900'
//             }`}>
//               {workout.name}
//             </h3>
//             <p className={`mb-4 ${
//               darkMode ? 'text-gray-300' : 'text-gray-600'
//             }`}>
//               {workout.description}
//             </p>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200" onClick={() => navigate('/squat')}>
//               Start Workout
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ darkMode }) => {
  const workouts = [
    { id: 1, name: 'Squats', description: 'Perfect for leg day', path: '/squat' },
    { id: 2, name: 'Push-ups', description: 'Build upper body strength', path: '/pushups' },
    { id: 3, name: 'Crunches', description: 'Core strengthening exercise', path: '/crunches' }
  ];
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <h1 className={`text-4xl font-bold mb-8 text-center bg-gradient-to-r ${
        darkMode ? 'from-blue-400 to-purple-500' : 'from-blue-600 to-purple-700'
      } bg-clip-text text-transparent`}>
        Welcome to FLEX-IT-OUT 💪
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className={`rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 ${
              darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <span className={`text-2xl font-bold ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {workout.name.charAt(0)}
                </span>
              </div>
              <h3 className={`text-2xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {workout.name}
              </h3>
              <p className={`mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {workout.description}
              </p>
              <button
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                    : 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white'
                }`}
                onClick={() => navigate(workout.path)}
              >
                Start Workout
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;