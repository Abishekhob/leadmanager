import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import axios from '../axiosInstance';


import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/AdminNavbar.css';



const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default function AdminNavbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
 const fetchUnreadCount = async () => {
  try {
    const response = await axios.get(`/api/notifications/unread-count`, {
      params: { userId }
    });

    const count = response.data;

    // Only trigger blinking when the unread count *increases*
    setIsNewNotification((prev) => count > unreadCount);
    setUnreadCount(count);
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
  }
};

fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [userId, token, unreadCount]); // Added `unreadCount` dependency to track changes

  return (
    <>
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      className="sticky-top shadow-sm border-bottom px-3"
      style={{ zIndex: 1020 }}
    >
      <Container fluid>
        <Navbar.Brand className="fw-bold text-primary fs-4">
          Admin Panel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto d-flex align-items-center gap-2">
            <NavLink to="/admin-dashboard" className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/manage-users" className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}>
              Manage Users
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}>
              Reports
            </NavLink>
            <NavLink
              to="/notifications"
              className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}
              style={{
                color: isNewNotification ? 'red' : 'black',
                opacity: isNewNotification ? 0.5 : 1,
                transition: 'opacity 0.4s ease-in-out, color 0.4s ease-in-out',
                position: 'relative',
              }}
              onClick={() => setIsNewNotification(false)} // Stop blinking when user navigates
            >
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  width: '15px',
                  height: '15px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '9px',
                  position: 'absolute',
                  top: '10px',
                  right: '2px',
                  transform: 'translate(50%, -50%)',
                  pointerEvents: 'none',
                }}>
                  {unreadCount}
                </span>

              )}
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}>
              Profile
            </NavLink>
              <button className="btn btn-outline-danger ms-3" onClick={() => setShowLogoutModal(true)}>
                Logout
              </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
     {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  
  );
}
