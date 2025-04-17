import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../assets/style/profile.css";

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire('Error', 'Please login to continue', 'error');
        return;
      }

      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/profile/view`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProfile(response.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D44B5]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F9F9]">
      {/* Sidebar */}
      <div className="w-64 bg-[#4D44B5] text-white sidebar">
        {/* ... Your existing sidebar code ... */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 mt-7 main-content">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="description">
            <h1 className="text-2xl font-semibold text-[#4D44B5]">View Profile</h1>
          </div>
        </header>

        <div className="main-content">
          <div className="content">
            <div className="student-details">
              <h2 className='m-white'>Profile Information</h2>
            </div>

            {profile && (
              <div className="profile-info">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name</label>
                    <p>{profile.name}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{profile.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Role</label>
                    <p>{profile.role}</p>
                  </div>
                  <div className="info-item">
                    <label>School</label>
                    <p>{profile.school_name || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
