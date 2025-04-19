import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const TeacherProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone_number: '',
    address: '',
    about: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          'https://attendipen-d65abecaffe3.herokuapp.com/profile/me',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setFormData({
          name: response.data.name || '',
          gender: response.data.gender || '',
          phone_number: response.data.phone_number || '',
          address: response.data.address || '',
          about: response.data.about || ''
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load profile data',
          icon: 'error',
          confirmButtonColor: '#1a237e'
        });
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploading(true);

    try {
      if (image) {
        const formDataForImage = new FormData();
        formDataForImage.append('profile_picture', image);

        const imageResponse = await axios.put(
          'https://attendipen-d65abecaffe3.herokuapp.com/profile/edit',
          formDataForImage,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('Image upload response:', imageResponse.data);
      }

      const response = await axios.put(
        'https://attendipen-d65abecaffe3.herokuapp.com/profile/edit',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUserData = {
          ...userData,
          ...formData,
          profile_picture: image ? URL.createObjectURL(image) : userData.profile_picture,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        console.log('Profile update response:', response.data);
        console.log('Updated user data:', updatedUserData);

        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully',
          icon: 'success',
          confirmButtonColor: '#1a237e'
        }).then(() => {
          navigate('/MyProfile');
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update profile',
        icon: 'error',
        confirmButtonColor: '#1a237e'
      });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-content">
        <div className="profile-card">
          <div className="card-header">
            <div className="header-content">
              <h2>Edit Profile</h2>
              <button
                onClick={() => navigate('/TeachersDashboard')}
                className="close-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <label>Profile Picture</label>
              <div className="image-upload">
                <div className="upload-control">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                    id="profile-picture"
                  />
                  <label
                    htmlFor="profile-picture"
                    className="upload-button"
                  >
                    Choose Image
                  </label>
                </div>
                {preview && (
                  <div className="image-preview">
                    <img
                      src={preview}
                      alt="Preview"
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
              {error && (
                <div className="error-message">{error}</div>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/ProfileDetails')}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`submit-button ${saving ? 'disabled' : ''}`}
              >
                {saving ? (
                  <div className="button-content">
                    <div className="spinner"></div>
                    <span>Saving Changes...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileEdit;
