import React, { useState, useEffect } from 'react';
import instance from '../axiosInstance';

function AdminResetPassword() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Fetch non-admin users on load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await instance.get('/api/users/non-admin-users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    fetchUsers();
  }, []);

  const handleReset = async () => {
    if (!userId || !newPassword) {
      setMessage('User and password are required.');
      return;
    }

    try {
      const res = await instance.post('/api/admin/reset-password', {
        userId,
        newPassword,
      });
      setMessage(res.data);
      setNewPassword('');
    } catch (err) {
      setMessage(err.response?.data || 'Error resetting password');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '430px' }}>
      

      <div className="mb-3">
        <label htmlFor="userSelect" className="form-label">
          Select User
        </label>
        <select
          id="userSelect"
          className="form-select"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="newPassword" className="form-label">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          className="form-control"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-primary mb-2 w-100" onClick={handleReset}>
        Reset Password
      </button>

      {message && (
        <div
          className={`mt-3 alert ${
            message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')
              ? 'alert-danger'
              : 'alert-success'
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default AdminResetPassword;
