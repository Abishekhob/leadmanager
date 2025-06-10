  // src/axiosInstance.js
  import axios from 'axios';

  const instance = axios.create({
<<<<<<< HEAD
<<<<<<< HEAD
    baseURL: "https://leadmanager-wfaq.onrender.com", // base URL for your Spring Boot backend
=======
     baseURL: process.env.REACT_APP_API_BASE_URL,  // base URL for your Spring Boot backend
>>>>>>> 12c575d (Updated axios instance 2)
=======
     baseURL: process.env.REACT_APP_API_BASE_URL, // base URL for your Spring Boot backend
>>>>>>> 327dcda (Updated axios instance 3)
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
