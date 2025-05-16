import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/AdminNavbar.css';

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default function AdminNavbar() {
  return (
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
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/manage-users"
              className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}
            >
              Manage Users
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}
            >
              Reports
            </NavLink>
            <NavLink
              to="/notifications"
              className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}
            >
              Notifications
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-link custom-nav ${isActive ? 'active' : ''}`}
            >
              Profile
            </NavLink>
            <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
              Logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
