import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance'; // Assuming you set this up
import AdminNavbar from '../components/AdminNavbar';
import AdminResetPassword from '../components/AdminResetPassword';

const roles = ['ADMIN', 'USER', 'PROPOSAL_CREATOR'];// or get it from context or props

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editedRoles, setEditedRoles] = useState({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('USER');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users/non-admin-users');
      if (Array.isArray(res.data)) {
        setUsers(res.data);
        setEditedRoles({});
      } else {
        console.error('Unexpected response:', res.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    }
  };

  const handleRoleChange = (id, newRole) => {
    setEditedRoles((prev) => ({ ...prev, [id]: newRole }));
  };

  const saveRoleChange = async (id) => {
    const user = users.find(u => u.id === id);
    const newRole = editedRoles[id];

    if (!newRole || newRole === user.role) return;

    const confirmed = window.confirm(`Are you sure you want to change role to ${newRole}?`);
    if (!confirmed) return;

    try {
      await axios.put(`api/users/${id}`, { ...user, role: newRole });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm('This will delete all related data (leads, notifications, etc). Proceed?');
    if (!confirmed) return;

    try {
      await axios.delete(`api/users/${id}`); // backend handles cascade deletion
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const inviteUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('api/users/register/mail', {
        email: inviteEmail,
        password: 'temporary123',
        name: inviteEmail.split('@')[0],
        role: inviteRole,
      });
      setInviteEmail('');
      setInviteRole('USER');
      fetchUsers();
    } catch (err) {
      console.error('Failed to invite user:', err);
    }
  };

const disableUser = async (id) => {
  const confirmed = window.confirm('Are you sure you want to disable this user? They will not be able to log in.');
  if (!confirmed) return;

  try {
    await axios.patch(`/api/users/${id}/disable`);
    fetchUsers();
  } catch (err) {
    console.error('Failed to disable user:', err);
  }
};

const reactivateUser = async (id) => {
  const confirmed = window.confirm('Reactivate this user and allow login access again?');
  if (!confirmed) return;

  try {
    await axios.patch(`/api/users/${id}/reactivate`);
    fetchUsers();
  } catch (err) {
    console.error('Failed to reactivate user:', err);
  }
};

  return (
    <>
      <AdminNavbar />
      
      <div className="container mt-4">
        <h5>Invite User</h5>
        <form onSubmit={inviteUser} className="row g-2 mb-4">
          <div className="col-md-5">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={inviteEmail}
              required
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary">Invite</button>
          </div>
        </form>

        <div className="my-3">
  <button
    className="btn btn-outline-secondary"
    data-bs-toggle="modal"
    data-bs-target="#resetPasswordModal"
  >
    Reset User Password
  </button>
</div>
        <h3>Manage Users</h3>
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
             {users
    .map(user => {
    const pendingRole = editedRoles[user.id] ?? user.role;
              return (
                <tr
                  key={user.id}
                  className={user.status === 'INACTIVE' ? 'table-secondary text-muted' : ''}
                >
                  <td>{user.name || '—'}</td>
                  <td>{user.email}</td>
                  <td className="d-flex align-items-center gap-2">
                    <select
                      className="form-select"
                      value={pendingRole}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {pendingRole !== user.role && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => saveRoleChange(user.id)}
                      >
                        Save
                      </button>
                    )}
                  </td>
                  <td>         
                  {user.status === 'INACTIVE' ? (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => reactivateUser(user.id)}
                    >
                      Reactivate
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => disableUser(user.id)}
                    >
                      Disable
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>    
      </div>
      {/* Modal for resetting user password */}
      <div
        className="modal fade"
        id="resetPasswordModal"
        tabIndex="-1"
        aria-labelledby="resetPasswordModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="resetPasswordModalLabel">Reset User Password</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <AdminResetPassword />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
