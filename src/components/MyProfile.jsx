import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://attendipen-d65abecaffe3.herokuapp.com/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <p className="text-gray-900">{profile.name}</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <p className="text-gray-900">{profile.email}</p>
          </div>
          
          {profile.gender && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Gender</label>
              <p className="text-gray-900">{profile.gender}</p>
            </div>
          )}
          
          {profile.phone_number && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <p className="text-gray-900">{profile.phone_number}</p>
            </div>
          )}
          
          {profile.address && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <p className="text-gray-900">{profile.address}</p>
            </div>
          )}
          
          {profile.about && (
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700 font-medium mb-2">About</label>
              <p className="text-gray-900">{profile.about}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
