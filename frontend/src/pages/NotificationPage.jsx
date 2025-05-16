// src/pages/NotificationsPage.js
import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Notifications from '../components/Notifications';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NotificationsPage() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/leads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(response.data);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
        toast.error('Failed to fetch leads');
        if (error.response && error.response.status === 401) {
          window.location.href = '/';
        }
      }
    };

    fetchLeads();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="container my-4">
        <Notifications leads={leads} />
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={true} />
    </div>
  );
}
