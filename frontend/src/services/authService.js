import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users'; // Update with your backend URL

// Register user
const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data)); // Store user data in localStorage
  }
  return response.data;
};

// Login user
const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/login`, loginData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data)); // Store user data in localStorage
  }
  return response.data;
};

// Logout user
const logoutUser = () => {
  localStorage.removeItem('user'); // Remove user data from localStorage
};

// Get user profile
const getUserProfile = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  }
  return null;
};

// Password reset request (send code)
const sendVerificationCode = async (email) => {
  const response = await axios.post(`${API_URL}/send-code`, { email });
  return response.data;
};

// Reset password using code
const resetPassword = async (email, code, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password`, { email, code, newPassword });
  return response.data;
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  sendVerificationCode,
  resetPassword,
};
