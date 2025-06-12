import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CreateLeadModal = ({ show, onClose, initialData = null, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    assignedTo: '',
    status: 'NEW',
    notes: ''
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  axios.get('/api/users/non-admin-users')
    .then(res => {
        console.log("📥 Incoming Users from API:", res.data); 
           setUsers(res.data);
    })
    .catch(err => {
      console.error("❌ Error fetching users:", err);
    });
}, []);


  useEffect(() => {
    if (initialData && show) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        source: initialData.source || '',
        assignedTo: initialData.assignedTo?.id || '',
        status: initialData.status || 'NEW',
        notes: initialData.notes || ''
      });
    }
  }, [initialData, show]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const dataToSend = {
      ...formData,
      assignedTo: formData.assignedTo === '' ? null : formData.assignedTo,
      source: formData.source.trim() === '' ? 'Manual' : formData.source.trim()
    };

    try {
      if (initialData) {
        await axios.put(`/api/leads/${initialData.id}`, dataToSend);
      } else {
        await axios.post('/api/leads/create', dataToSend);
      }      

      toast.success(`Lead ${initialData ? 'updated' : 'created'} successfully!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Error saving lead.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    setLoading(true);
    const fileData = new FormData();
    fileData.append('file', file);

    try {
      await axios.post('/api/leads/upload', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('File uploaded and Leads created!');
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit / Assign Lead' : 'Create New Lead'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && (
          <div className="d-flex justify-content-center mb-3">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Name" value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })} required />

          <input className="form-control mb-2" placeholder="Email" value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })} />

          <input className="form-control mb-2" placeholder="Phone" value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })} />

          <input className="form-control mb-2" placeholder="Source" value={formData.source}
            onChange={e => setFormData({ ...formData, source: e.target.value })} />

      <div className="mb-2">
  <label className="form-label">Assign to</label>
  <div className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
    {users.map(user => {
      const imageUrl = user.profilePicture
        ? `/uploads/profile_pictures/${user.profilePicture}`
        : '/default-profile.png';

      return (
        <div
          key={user.id}
          className={`list-group-item list-group-item-action d-flex align-items-center ${formData.assignedTo === user.id ? 'active' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setFormData({ ...formData, assignedTo: user.id })}
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
</div>



          <textarea className="form-control mb-2" placeholder="Notes"
            value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />

          <Button type="submit" variant="primary" className="w-100 mt-2" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Lead' : 'Create Lead'}
          </Button>
        </form>

        {/* Hide file upload when editing */}
        {!initialData?.id && (
          <>
            <hr className="my-4" />
            <p className="text-center text-muted mb-2">OR Upload CSV/Excel</p>

            <form onSubmit={handleFileUpload}>
              <input type="file" className="form-control mb-2" onChange={(e) => setFile(e.target.files[0])} />
              <Button type="submit" variant="secondary" className="w-100" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload File'}
              </Button>
            </form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CreateLeadModal;
