import React, { useState } from 'react';
import axios from '../axiosInstance'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminRegisterForm = () => {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/auth/register-admin', adminData); // Ensure this route exists in your backend
      toast.success("Admin created successfully");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control my-2"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control my-2"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control my-2"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary">Create Admin</button>
      </form>
    </div>
  );
};

export default AdminRegisterForm;
