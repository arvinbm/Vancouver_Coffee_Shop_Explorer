// src/api/client.ts
//
// A single Axios instance shared by all API modules.
// Before each request, it reads the JWT from localStorage and attaches it
// as an Authorization header — so every protected endpoint gets the token
// automatically without each caller having to set it manually.

import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
});

// Request interceptor: runs before every request this client sends.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
