import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosInstance';
import { toast } from 'react-toastify';
import './styles/LoginRegisterStyle.css';

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

    if (!form.name.trim()) return toast.error('Name is required');
    if (!emailRegex.test(form.email)) return toast.error('Enter a valid email');
    if (!phoneRegex.test(form.phoneNumber)) return toast.error('Enter a valid 10-digit phone');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');

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
  <div
  className="p-4 rounded"
  style={{
    backgroundColor: 'transparent',
    backdropFilter: 'none',
    color: '#fff',
    width: '100%',
    maxWidth: '400px',
    margin: '3rem auto',
  }}
>
  <h3 className="mb-4 text-center text-white">Register</h3>
  <form onSubmit={handleRegister}>
    <input
      className="form-control mb-3 custom-input"
      name="name"
      placeholder="Name"
      onChange={handleChange}
      value={form.name}
      required
    />
    <input
      className="form-control mb-3 custom-input"
      name="email"
      type="email"
      placeholder="Email"
      onChange={handleChange}
      value={form.email}
      required
    />
    <input
      className="form-control mb-3 custom-input"
      name="phoneNumber"
      placeholder="Phone"
      onChange={handleChange}
      value={form.phoneNumber}
      required
    />
    <input
      className="form-control mb-3 custom-input"
      name="password"
      type="password"
      placeholder="Password"
      onChange={handleChange}
      value={form.password}
      required
    />
    <input
      className="form-control mb-4 custom-input"
      name="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      onChange={handleChange}
      value={form.confirmPassword}
      required
    />
    <button
      className="btn w-100 mb-3"
      type="submit"
      style={{ backgroundColor: '#FF5F1F', color: '#fff', border: 'none' }} // custom color
    >
      Register
    </button>
  </form>

  {!embedded ? (
    <div className="text-center">
      Already a user?{' '}
      <Link
        to="/login"
        className="text-decoration-underline"
        style={{ color: '#FF5F1F' }} // match button color
      >
        Login
      </Link>
    </div>
  ) : (
    <div className="text-center">
      Already a user?{' '}
      <button
        className="btn btn-link p-0 text-decoration-underline"
        style={{ color: '#FF5F1F' }}
        onClick={switchToLogin}
      >
        Login
      </button>
    </div>
  )}
</div>

  );
}
