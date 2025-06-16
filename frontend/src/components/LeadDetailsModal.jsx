import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '../axiosInstance';
import CreateLeadModal from './leads/CreateLeadModal';
import { toast } from 'react-toastify';


export default function LeadDetailsModal({ show, lead, onHide, onLeadUpdated }) {
  const role = localStorage.getItem("role");
  const [activities, setActivities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState(lead?.category || '');

  useEffect(() => {
  if (lead?.category) {
    setCategory(lead.category);
  }
}, [lead]);

  useEffect(() => {
    
    const fetchActivities = async () => {
      if (lead?.id) {

        try {
          const res = await axios.get(`/api/lead-activities/lead/${lead.id}`);
          setActivities(res.data);
        } catch (err) {
          console.error('Failed to fetch activities:', err);
        }
      }
    };

    const fetchUsers = async () => {
      try {
        
        const res = await axios.get('/api/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchActivities();
    fetchUsers();
  }, [lead]);

  const handleAssign = async () => {
    if (!assignUserId) return;
    try {
     
      await axios.put(`/api/leads/${lead.id}/assign?userId=${assignUserId}`, null);
      toast.success('Lead assigned!');
      setAssignUserId('');
      onHide(); // Refresh modal or reload leads
      onLeadUpdated(); // optional: refresh list
    } catch (err) {
      console.error('Assignment failed:', err);
    }
  };



  const [showConfirm, setShowConfirm] = useState(false);
const [selectedLeadId, setSelectedLeadId] = useState(null);

const handleDeleteConfirm = (id) => {
  setSelectedLeadId(id);
  setShowConfirm(true);
};

const deleteLead = async (id) => {
  try {
 
    await axios.delete(`/api/leads/${id}`);

    toast.success("Lead deleted successfully");
    setShowConfirm(false);
    onHide();

    // ✅ Tell parent to refresh the leads list
    onLeadUpdated();
    // Refresh list or navigate away
  } catch (err) {
    toast.error("Failed to delete lead");
    console.error(err);
  }
};

if (!lead) return null;

const previewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'txt'];

const getFileExtension = (filename) => {
  return filename?.split('.').pop()?.toLowerCase();
};

const isPreviewable = (fileUrl) => {
  const fileName = fileUrl?.split('/').pop();
  const ext = getFileExtension(fileName);
  return previewableExtensions.includes(ext);
};

const handleUpdateCategory = async () => {
  if (!category) return;

  try {
    
    await axios.put(`/api/leads/${lead.id}/update-category?category=${category}`, null);
    toast.success('Lead category updated!');
    onLeadUpdated(); // Optionally refresh the lead list or any other UI changes
  } catch (err) {
    console.error('Failed to update lead category:', err);
    toast.error('Failed to update category');
  }
};

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Lead Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-3">Lead Information</h5>
          <ul className="list-group mb-4">
            <li className="list-group-item"><strong>Name:</strong> {lead.name}</li>
            <li className="list-group-item"><strong>Email:</strong> {lead.email}</li>
            <li className="list-group-item"><strong>Phone:</strong> {lead.phone}</li>
            <li className="list-group-item"><strong>Status:</strong> {lead.status}</li>
            <li className="list-group-item"><strong>Source:</strong> {lead.source}</li>
            <li className="list-group-item">
              <strong>Assigned To:</strong>
              {lead.assignedTo ? (
                <div className="d-flex align-items-center mt-2 p-2 border rounded" style={{ maxWidth: '300px' }}>
                  <img
                    src={lead.assignedTo.profilePicture
                      ? `${import.meta.env.VITE_API_BASE_URL}/uploads/profile_pictures/${lead.assignedTo.profilePicture}`
                      : '/default-profile.png'}
                    alt={lead.assignedTo.name}
                    className="rounded-circle me-2"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.png';
                    }}
                  />
                  <span>{lead.assignedTo.name}</span>
                </div>
              ) : (
                <span className="ms-2 text-muted">Not assigned</span>
              )}
            </li>
            <li className="list-group-item"><strong>Notes:</strong> {lead.notes}</li>
            <li className="list-group-item"><strong>Created:</strong> {new Date(lead.createdAt).toLocaleString()}</li>
            {lead.outcome && <li className="list-group-item"><strong>Outcome:</strong> {lead.outcome}</li>}
          </ul>

     {!lead.assignedTo && (
  <>
    <h5 className="mb-3">Assign Lead</h5>

    {/* Selected user preview */}
    {assignUserId && (
      <div className="d-flex align-items-center mb-2 p-2 border rounded bg-light">
        <img
          src={
            users.find(user => user.id === assignUserId)?.profilePicture
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/profile_pictures/${users.find(user => user.id === assignUserId).profilePicture}`
              : '/default-profile.png'
          }
          alt="Selected User"
          className="rounded-circle me-2"
          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-profile.png';
          }}
        />
        <span>{users.find(user => user.id === assignUserId)?.name}</span>
      </div>
    )}

    {/* Scrollable list */}
    <div className="mb-2 list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {users
        .filter(user => user.role !== "ADMIN" && user.name?.trim())
        .map(user => {
          const imageUrl = user.profilePicture
            ? `${import.meta.env.VITE_API_BASE_URL}/uploads/profile_pictures/${user.profilePicture}`
            : '/default-profile.png';

          return (
            <div
              key={user.id}
              className={`list-group-item list-group-item-action d-flex align-items-center ${assignUserId === user.id ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setAssignUserId(user.id)}
            >
              <img
                src={imageUrl}
                alt={user.name}
                className="rounded-circle me-2"
                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-profile.png';
                }}
              />
              <span>{user.name}</span>
            </div>
          );
        })}
    </div>

    <Button
      variant="primary"
      onClick={handleAssign}
      disabled={!assignUserId}
    >
      Assign
    </Button>
  </>
)}


{role === "USER" && (
          <>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
              >
                  <option value="" disabled>-- Select Category --</option>
                  <option value="HOT">Hot</option>
                  <option value="WARM">Warm</option>
                  <option value="COLD">Cold</option>
              </Form.Select>

            </Form.Group>
            <Button variant="primary" onClick={handleUpdateCategory}>
              Update Category
            </Button>
          </>
        )}

          
<h5 className="mt-4 mb-3">Activity History</h5>
{activities.length === 0 ? (
  <p className="text-muted">No activity yet for this lead.</p>
) : (
  <ul className="list-group">
    {activities.map((activity) => (
      <li key={activity.id} className="list-group-item">
        <div>
          <strong>{activity.action}</strong> —{' '}
          {new Date(activity.timestamp).toLocaleString()}
        </div>

        {activity.note && (
          <div className="text-muted">Note: {activity.note}</div>
        )}
{activity.fileUrl && (
  <div className="mt-2">
    {isPreviewable(activity.fileUrl) && (
      <>
        {activity.fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) && (
          <>
            <div>🖼️ Image:</div>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/files/${activity.fileUrl}`}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '150px' }}
            />
          </>
        )}

        {activity.fileUrl.match(/\.(mp4|webm)$/i) && (
          <>
            <div>🎥 Video:</div>
            <video
              controls
              style={{ maxWidth: '100%', maxHeight: '300px' }}
              src={`${import.meta.env.VITE_API_BASE_URL}/files/${activity.fileUrl}`}
            />
          </>
        )}

        {activity.fileUrl.endsWith('.pdf') && (
          <>
            <div>📄 PDF:</div>
            <iframe
              src={`${import.meta.env.VITE_API_BASE_URL}/files/${activity.fileUrl}`}
              style={{ width: '100%', height: '300px', border: 'none' }}
              title="PDF Preview"
            />
          </>
        )}

        {activity.fileUrl.endsWith('.txt') && (
          <>
            <div>📄 Text File:</div>
            <iframe
              src={`${import.meta.env.VITE_API_BASE_URL}/files/${activity.fileUrl}`}
              style={{ width: '100%', height: '150px', border: '1px solid #ccc' }}
              title="Text Preview"
            />
          </>
        )}
      </>
    )}

    {/* ✅ Always show download button below the preview or alone */}
    <a
      href={`${import.meta.env.VITE_API_BASE_URL}/files/${activity.fileUrl}`}
      download={activity.fileUrl.split('/').pop()}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-sm btn-outline-primary mt-2"
    >
      ⬇️ Download File
    </a>
  </div>
)}


      </li>
    ))}
  </ul>
)}

        </Modal.Body>

        {role === "ADMIN" && (
        <>
        <Modal.Footer> 
          <Button variant="warning" onClick={() => setShowEditModal(true)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDeleteConfirm(lead.id)}>
            Delete Lead
          </Button>
        </Modal.Footer>
        </>
      )}
      </Modal>

      <CreateLeadModal
  show={showEditModal}
  onClose={() => setShowEditModal(false)}
  initialData={lead}
  onSuccess={() => {
    setShowEditModal(false);
    onHide(); 
    onLeadUpdated();
  }}
/>

{/* Confirmation Modal */}
<Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to delete this lead?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
    <Button variant="danger" onClick={() => deleteLead(selectedLeadId)}>Delete</Button>
  </Modal.Footer>
</Modal>

    </>
  );
}
