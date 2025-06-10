  // src/axiosInstance.js
  import axios from 'axios';

  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // base URL for your Spring Boot backend
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