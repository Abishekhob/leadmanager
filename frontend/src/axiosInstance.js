// src/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // base URL for your Spring Boot backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization token from localStorage to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token in the Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;