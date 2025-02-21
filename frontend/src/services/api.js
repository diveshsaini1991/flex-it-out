
const API_URL = 'http://localhost:3000/api';

export const api = {
  
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',  
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();

     if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  }
  ,
  

  signup: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    console.log("response",response)
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    return response.json();
  },

  checkAuthStatus: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to check authentication');
      const data = await response.json();
      return data.authenticated; 
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  },

   getProfile: async () => {
    const response = await fetch(`${API_URL}/user/profile`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

   getWorkouts: async () => {
    const response = await fetch(`${API_URL}/workouts`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return response.json();
  },

  saveWorkout: async (workoutData) => {
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workoutData)
    });
    if (!response.ok) throw new Error('Failed to save workout');
    return response.json();
  },
  getUserChallenges: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/challenges', {
      headers: {
        'Authorization': `Bearer ${token}`
      }, credentials: 'include',
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch user challenges');
    return response.json();
  },
   getChallenges: async () => {
    const response = await fetch(`${API_URL}/challenges`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch challenges');
    return response.json();
  },

  joinChallenge: async (challengeId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/challenges/join/${challengeId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },credentials: 'include',
       
    });
    if (!response.ok) throw new Error('Failed to join challenge');
    return response.json();
  },
  
  getLeaderboard: async () => {
    const response = await fetch(`${API_URL}/leaderboard`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
  completeChallenge: async (challengeId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/challenges/complete/${challengeId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to complete challenge');
    return response.json();
  }
};