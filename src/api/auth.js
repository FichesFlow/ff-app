import axios from 'axios';

export async function login(email, password) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login_check`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function register(email, password, username) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
      email,
      password,
      username
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
