import React, { useEffect, useState } from 'react'
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

  if (loading) return (
    <div className={`text-center p-8 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      Loading...
    </div>
  );
  
  return (
    <div className="container mx-auto p-8">
      <h1 className={`text-3xl font-bold mb-8 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Leaderboard
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
                <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${
            darkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {leaders.map((leader, ind) => (
              <tr key={ind + 1} className={`${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">{ind + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{leader.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{leader.points}</td>
                <td className="px-6 py-4 whitespace-nowrap">{leader.workouts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard