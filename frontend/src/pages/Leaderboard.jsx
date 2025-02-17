import React from 'react'

const Leaderboard = () => {
    const leaders = [
      { rank: 1, name: 'Jane Smith', points: 2500, workouts: 50 },
      { rank: 2, name: 'Mike Johnson', points: 2300, workouts: 45 },
      { rank: 3, name: 'Sarah Wilson', points: 2100, workouts: 42 }
    ];
  
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