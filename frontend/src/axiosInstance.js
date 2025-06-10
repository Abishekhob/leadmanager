  // src/axiosInstance.js
  import axios from 'axios';

  const instance = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_BASE_URL,
=======
baseURL: import.meta.env.VITE_API_BASE_URL,

>>>>>>> 57588fe (env and homepage)
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
