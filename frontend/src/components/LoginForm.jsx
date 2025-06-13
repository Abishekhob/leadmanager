import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

export default function LoginForm({ embedded = false, switchToRegister }) {
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
        headers: { 'Content-Type': 'application/json' },
      });

      const { token, role, userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      if (role === "ADMIN") navigate('/admin-dashboard');
      else if (role === 'USER' || role === 'PROPOSAL_CREATOR') navigate('/user-dashboard');
      else console.warn("Unknown role");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
   <div
  className="p-4 rounded" // removed `shadow`
  style={{
    backgroundColor: 'transparent',
    backdropFilter: 'none',
    color: '#fff',
    width: '100%',
    maxWidth: '400px',
    margin: '3rem auto',
  }}
>
  <h3 className="mb-4 text-center text-white">Login</h3>
  <form onSubmit={handleLogin}>
    <input
      className="form-control mb-3"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.3)',
        '::placeholder': {
          color: '#e0e0e0',
        },
      }}
      name="email"
      placeholder="Email"
      value={form.email}
      onChange={handleChange}
      required
    />
    <input
      className="form-control mb-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.3)',
        '::placeholder': {
          color: '#e0e0e0',
        },
      }}
      name="password"
      type="password"
      placeholder="Password"
      value={form.password}
      onChange={handleChange}
      required
    />

    <button
      className="btn w-100 mb-3"
      type="submit"
      style={{ backgroundColor: '#FF5F1F', color: '#fff', border: 'none' }} // 🔶 your custom color
    >
      Login
    </button>
  </form>

  {!embedded ? (
    <div className="text-center">
      Need to sign up?{' '}
      <Link
        to="/register"
        className="text-decoration-underline"
        style={{ color: '#FF5F1F' }} // same color as login button
      >
        Register
      </Link>
    </div>
  ) : (
    <div className="text-center">
      Need to sign up?{' '}
      <button
        className="btn btn-link p-0 text-decoration-underline"
        style={{ color: '#FF5F1F' }}
        onClick={switchToRegister}
      >
        Register
      </button>
    </div>
  )}
</div>

  );
}
