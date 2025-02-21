import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';

const Leaderboard = ({ darkMode }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard();
        setLeaders(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className={`text-4xl font-bold mb-8 text-center ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Leaderboard 🏆
      </h1>
      
      <div className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-200 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <table className="min-w-full">
          <thead className={`${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              {['Rank', 'Name', 'Points', 'Workouts'].map((header) => (
                <th
                  key={header}
                  className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${
            darkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {leaders.map((leader, ind) => (
              <tr
                key={ind + 1}
                className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-100'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      ind === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : ind === 1
                        ? 'bg-gray-300 text-gray-900'
                        : ind === 2
                        ? 'bg-orange-400 text-orange-900'
                        : darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {ind + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={""}
                        alt={leader.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {leader.name}
                      </div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        @{leader.name.toLowerCase().replace(/\s+/g, '')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                  }`}>
                    {leader.points} pts
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {leader.workouts} workouts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;