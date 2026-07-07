import axios from 'axios';

let apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (apiURL && !apiURL.startsWith('http://') && !apiURL.startsWith('https://')) {
  // If Render Blueprint only provides the raw host, format it properly
  apiURL = `https://${apiURL}/api`;
} else if (apiURL && !apiURL.endsWith('/api') && !apiURL.endsWith('/api/')) {
  apiURL = apiURL.endsWith('/') ? `${apiURL}api` : `${apiURL}/api`;
}

const API = axios.create({
  baseURL: apiURL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;