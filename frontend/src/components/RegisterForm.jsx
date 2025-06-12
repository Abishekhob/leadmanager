import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosInstance';
import { toast } from 'react-toastify';

export default function RegisterForm({ embedded = false, switchToLogin }) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.name.trim()) {
      toast.error('Name is required');
      return false;
    }

    if (!emailRegex.test(form.email)) {
      toast.error('Enter a valid email address');
      return false;
    }

   if (!phoneRegex.test(form.phoneNumber)) {
      toast.error('Enter a valid 10-digit phone number');
      return false;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
  name: form.name.trim(),
  email: form.email.trim(),
  phoneNumber: form.phoneNumber.trim(),
  password: form.password,
  role: 'USER',
};


      await axios.post('/api/users/register', payload);
      toast.success('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Error registering');
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3>Register</h3>
      <form onSubmit={handleRegister}>
        <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange} value={form.name} required />
        <input className="form-control mb-2" name="email" placeholder="Email" type="email" onChange={handleChange} value={form.email} required />
        <input className="form-control mb-2" name="phoneNumber" placeholder="Phone" onChange={handleChange} value={form.phone} required />
        <input className="form-control mb-2" name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} required />
        <input className="form-control mb-3" name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} value={form.confirmPassword} required />
        <button className="btn btn-success w-100" type="submit">Register</button>
      </form>
    {!embedded ? (
  <div className="mt-3 text-center">
    Already a user? <Link to="/login">Login</Link>
  </div>
) : (
  <div className="mt-3 text-center">
    Already a user? <button className="btn btn-link p-0" onClick={switchToLogin}>Login</button>
  </div>
)}
    </div>
  );
}
