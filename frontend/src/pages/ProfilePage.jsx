import React, { useEffect, useRef, useState } from 'react';
import axios from '../axiosInstance';
import { FaPen } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phoneNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);  // New state for role
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // holds the file to be uploaded

  const fileInputRef = useRef(null);


  useEffect(() => {
    axios.get('/api/profile')
      .then((res) => {
        const { role, ...userData } = res.data;
        setUser(userData);
        setUserRole(role);  // Store the role
        setFormData({
          name: userData.name || '',
          bio: userData.bio || '',
          phoneNumber: userData.phoneNumber || '',
        });
      })
      .catch((err) => {
        toast.error('Error fetching user data:', err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
        name: formData.name.trim() || user.name,
        bio: formData.bio.trim() || user.bio,
        phoneNumber: formData.phoneNumber.trim() || user.phoneNumber,
    };

    try {
        const response = await axios.put('/api/profile', updatedData);
        setUser((prevUser) => ({ ...prevUser, ...updatedData }));
        toast.success('Profile updated!');
        setIsEditing(false);
    } catch (err) {
        toast.error('Error updating profile:', err);
    }
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview immediately
    setSelectedFile(file); // store selected file
    setPreviewImage(URL.createObjectURL(file)); // show preview only
  };

 const handlePictureUpload = async () => {
  if (!selectedFile) return;

  const data = new FormData();
  data.append('file', selectedFile);

  try {
    const response = await axios.post('/api/profile/upload-picture', data);
    const newProfilePicture = response.data.profilePicture;

    // Directly update the profile picture URL for instant update without refresh
    setUser((prevUser) => ({
      ...prevUser,
      profilePicture: newProfilePicture // Store the updated profile picture in the state
    }));

    // Reset preview image and selected file for further uploads
    setPreviewImage(null);
    setSelectedFile(null);

    toast.success('Profile picture updated!');
  } catch (err) {
    toast.error('Error uploading profile picture');
  }
};
 

  const handlePictureClick = () => {
    fileInputRef.current.click();
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {/* Render the appropriate navbar based on role */}
      {userRole === 'ADMIN' && <AdminNavbar />}

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2>My Profile</h2>
          </div>

          <div style={styles.profilePicWrapper}>
            <img
              src={
                previewImage
                  ? previewImage
                  : user.profilePicture
                    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/profile_pictures/${user.profilePicture}`
                    : '/default-profile.png'
              }
              alt="Profile"
              style={styles.profileImage}
            />

            <div style={styles.penIcon} onClick={handlePictureClick}>
              <FaPen size={14} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePictureChange}
                style={{ display: 'none' }}
                accept="image/*"
              />
            </div>

            {/* Show Save Button only if preview image is set */}
            {previewImage && (
              <button onClick={handlePictureUpload} style={styles.saveButton}>
                Save Picture
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                style={styles.input}
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                style={styles.textarea}
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                style={styles.input}
              />
              <button type="submit" style={styles.submitButton}>Save</button>
            </form>
          ) : (
            <div style={styles.infoBox}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Bio:</strong> {user.bio}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phoneNumber}</p>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                  <FaPen style={{ marginRight: 6 }} /> Edit Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  card: { maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' },
  header: { textAlign: 'center', marginBottom: '20px' },
  profilePicWrapper: { position: 'relative', textAlign: 'center' },
  profileImage: { width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' },
  penIcon: {
  position: 'absolute', bottom: '10px',  left: '10px', backgroundColor: '#fff', padding: '5px', borderRadius: '50%', boxShadow: '0 0 4px rgba(0,0,0,0.2)',
  cursor: 'pointer',
},
  saveButton: {
    marginTop: '10px',
    padding: '6px 12px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  form: { display: 'flex', flexDirection: 'column' },
  input: { marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  textarea: { marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', height: '100px' },
  submitButton: { background: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' },
  infoBox: { textAlign: 'left' },
  editButton: { padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default ProfilePage;
