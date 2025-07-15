import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL;

// User authentication
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/users/register`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/users/login`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export async function apiLogin(email, password) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return await res.json();
}

// Task management
export const fetchTasks = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const createTask = async (taskData, token) => {
    try {
        const response = await axios.post(`${API_URL}/api/tasks`, taskData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteTask = async (taskId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Additional functions for analytics can be added here as needed.