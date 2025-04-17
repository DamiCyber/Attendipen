import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First, try to get data from local storage
        const localData = JSON.parse(localStorage.getItem("userData") || "{}");
        
        if (localData && Object.keys(localData).length > 0) {
          console.log("Using profile data from local storage:", localData);
          setProfile(localData);
          setLoading(false);
        }

        // Then fetch from API to ensure we have the latest data
        console.log('Fetching profile data from API...');
        const token = localStorage.getItem('token');
        const response = await axios.get('https://attendipen-d65abecaffe3.herokuapp.com/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Profile data received from API:', response.data);
        
        // Update local storage with API data
        localStorage.setItem("userData", JSON.stringify({
          ...localData,
          ...response.data
        }));
        
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load profile data',
          icon: 'error',
          confirmButtonColor: '#4D44B5'
        });
        setLoading(false);
      }
    };

    fetchProfile();
  }, [refreshKey]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6">No profile data found</div>;

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <Link to="/ProfileEdit" className="bg-[#152259] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#0f1a4a] transition duration-200">
            Edit Profile
          </Link>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#4D44B5] mb-4">
            {profile.profile_picture ? (
              <img 
                src={profile.profile_picture} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onLoad={() => console.log('Profile image loaded successfully')}
                onError={(e) => {
                  console.error('Error loading profile image');
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block font-medium text-gray-700">Name</label>
            <p className="mt-1">{profile.name || "Not provided"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block font-medium text-gray-700">Email</label>
            <p className="mt-1">{profile.email || "Not provided"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block font-medium text-gray-700">Gender</label>
            <p className="mt-1 capitalize">{profile.gender || "Not specified"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block font-medium text-gray-700">Phone Number</label>
            <p className="mt-1">{profile.phone_number || "Not provided"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
            <label className="block font-medium text-gray-700">Address</label>
            <p className="mt-1">{profile.address || "Not provided"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
            <label className="block font-medium text-gray-700">About</label>
            <p className="mt-1">{profile.about || "Not provided"}</p>
          </div>

          {profile.updatedAt && (
            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
              <label className="block font-medium text-gray-700">Last Updated</label>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(profile.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
