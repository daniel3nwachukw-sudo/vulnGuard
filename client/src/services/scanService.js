import axios from 'axios';

// Use relative API path so the client works whether served from Vite or the server.
const baseURL = import.meta.env.VITE_API_URL || '/api';

export async function runScan(target, ports = [80, 443, 8080]) {
  const response = await axios.post(`${baseURL}/scan`, { target, ports });
  return response.data;
}
