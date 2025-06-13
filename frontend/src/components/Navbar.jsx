import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';

export default function Navbar({
  onNavigate,
  currentView,
  userRole,
  userBadgeCount = 0,
  creatorBadgeCount = 0
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    let prevCount = unreadCount;

    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(`/api/notifications/unread-count?userId=${userId}`);
        const count = response.data;

        if (count > prevCount) {
          setIsNewNotification(true);
          setTimeout(() => setIsNewNotification(false), 3000);
        }

        setUnreadCount(count);
        prevCount = count;
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [userId, unreadCount]);

  const navItems = [
    { name: 'Home', key: 'home' },
    { name: 'Notifications', key: 'notifications' },
    { name: 'Proposals', key: 'proposals' },
    { name: 'Profile', key: 'profile' },
  ];

  const renderBadge = (key) => {
    if (key === 'notifications' && unreadCount > 0) {
      return (
        <span className="badge-style">
          {unreadCount}
        </span>
      );
    }

    if (key === 'proposals') {
      const count = userRole === 'USER' ? userBadgeCount : creatorBadgeCount;
      if (count > 0) {
        return (
          <span className="badge-style">
            {count}
          </span>
        );
      }
    }

    return null;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-2 mb-4 sticky-top shadow" style={{ zIndex: 1020 }}>
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">User Dashboard</span>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row">
          {navItems.map((item) => (
            <li className="nav-item me-3 position-relative" key={item.key}>
              <span
                className={`nav-link ${currentView === item.key ? 'fw-bold text-primary' : ''}`}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  color: isNewNotification && item.key === 'notifications' ? 'red' : '',
                  opacity: isNewNotification && item.key === 'notifications' ? 0.5 : 1,
                  transition: 'opacity 0.4s ease-in-out, color 0.4s ease-in-out',
                }}
                onClick={() => onNavigate(item.key)}
              >
                {item.name}
                {renderBadge(item.key)}
              </span>
            </li>
          ))}
        </ul>
        <span
          className="nav-link text-danger"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </span>

        {showLogoutModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Logout</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to logout?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                  <button className="btn btn-danger" onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles for badge */}
      <style>
        {`
          .badge-style {
            background-color: red;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            position: absolute;
            top: 0px;
            right: -6px;
          }
        `}
      </style>
    </nav>
  );
}
