import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LeadDetailsModal from './LeadDetailsModal';

const Notifications = ({ leads = [] }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId || !token) {
        setError('User ID or token missing in localStorage.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/notifications/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 403) setError('You do not have permission to view notifications.');
        else if (status === 401) setError('You are not authorized. Please log in.');
        else setError('An error occurred while fetching notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, token]);

  const handleNotificationClick = async (id, leadId, isRead) => {
    try {
      if (!isRead) {
        await axios.put(
          `http://localhost:8080/api/notifications/${id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }

      const leadData = leads.find((lead) => lead._id === leadId || lead.id === leadId);
      if (!leadData) {
        setError('Lead data not found.');
        return;
      }

      setSelectedLead(leadData);
      setShowModal(true);
    } catch (err) {
      console.error('Notification click error:', err);
      setError('Failed to open lead details.');
    }
  };

  const renderNotification = (note) => (
    <div
      key={note.id}
      onClick={() => handleNotificationClick(note.id, note.leadId, note.read)}
      style={{
        cursor: 'pointer',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: note.read ? '#fff' : '#e6f7ff',
        border: '1px solid #ccc',
        transition: 'background 0.3s',
      }}
    >
      <strong>{note.message}</strong>
      <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#555' }}>
        {new Date(note.timestamp).toLocaleString()}
      </p>
    </div>
  );

  return (
    <div>
      <h4>Notifications</h4>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && notifications.length === 0 && <p>No notifications yet</p>}

      {!loading && !error && notifications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(renderNotification)}
        </div>
      )}

      {selectedLead && (
        <LeadDetailsModal
          show={showModal}
          lead={selectedLead}
          onHide={() => setShowModal(false)}
          onLeadUpdated={() => {
            // optionally refresh notifications or lead data here
          }}
        />
      )}
    </div>
  );
};

export default Notifications;
