import React, { useEffect, useState } from 'react'
import { api } from '../services/api.js';
const Leaderboard = () => {
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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workouts</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaders.map((leader) => (
                <tr key={leader.rank}>
                  <td className="px-6 py-4 whitespace-nowrap">{leader.rank}</td>
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