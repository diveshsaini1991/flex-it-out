
const API_URL = 'http://localhost:3000/api';

export const api = {
  // Auth API calls
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  },

  signup: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) throw new Error('Signup failed');
    return response.json();
  },

  // Profile API calls
  getProfile: async () => {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  // Workouts API calls
  getWorkouts: async () => {
    const response = await fetch(`${API_URL}/workouts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return response.json();
  },

  saveWorkout: async (workoutData) => {
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workoutData)
    });
    if (!response.ok) throw new Error('Failed to save workout');
    return response.json();
  },

  // Challenges API calls
  getChallenges: async () => {
    const response = await fetch(`${API_URL}/challenges`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch challenges');
    return response.json();
  },

  joinChallenge: async (challengeId) => {
    const response = await fetch(`${API_URL}/challenges/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ challengeId })
    });
    if (!response.ok) throw new Error('Failed to join challenge');
    return response.json();
  },

  // Leaderboard API calls
  getLeaderboard: async () => {
    const response = await fetch(`${API_URL}/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  }
};