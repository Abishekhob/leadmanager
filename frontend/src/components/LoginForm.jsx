import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/api/auth/login', form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token, role, userId } = response.data;

      // Store token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // Navigate based on role
      if (role === "ADMIN") {
        navigate('/admin-dashboard');
      } else if (role === 'USER' || role === 'PROPOSAL_CREATOR') {
        navigate('/user-dashboard');
      } else {
        console.warn("⚠️ Unknown role, staying on login.");
      }

      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      toast.error(errorMessage);
      console.error("❌ Login failed:", err);
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-2"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
    </div>
  );
}
