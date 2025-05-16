import React from 'react';
import { useNavigate } from 'react-router-dom';

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default function Navbar({ onNavigate }) {
  const navigate = useNavigate();

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light px-4 py-2 mb-4 sticky-top shadow"
      style={{ zIndex: 1020 }}
    >
      <h4 className="me-4 mb-0">User Dashboard</h4>
      <button className="btn btn-outline-primary me-2" onClick={() => onNavigate('home')}>
        Home
      </button>
     
      <button className="btn btn-outline-warning me-2" onClick={() => onNavigate('notifications')}>
        Notifications
      </button>
      <button className="btn btn-outline-success me-2" onClick={() => onNavigate('proposals')}>
        Proposals
      </button>
       <button className="btn btn-outline-secondary me-2" onClick={() => onNavigate('profile')}>
        Profile
      </button>
      <button className="btn btn-outline-danger ms-auto" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
