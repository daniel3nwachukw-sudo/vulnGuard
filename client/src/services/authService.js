import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export async function loginUser(email, password) {
  const response = await axios.post(`${baseURL}/auth/login`, { email, password });
  return response.data;
}

export async function registerUser(email, password) {
  const response = await axios.post(`${baseURL}/auth/register`, { email, password });
  return response.data;
}
