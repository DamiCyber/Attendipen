import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone_number: "",
    address: "",
    about: ""
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile data...");
        const response = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/profile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("Profile data received:", response.data);
        
        setFormData({
          name: response.data.name || "",
          gender: response.data.gender || "",
          phone_number: response.data.phone_number || "",
          address: response.data.address || "",
          about: response.data.about || ""
        });

        if (response.data.profile_picture) {
          setProfilePicture(response.data.profile_picture);
        }

        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        localStorage.setItem("userData", JSON.stringify({
          ...userData,
          ...response.data
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, refreshKey]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let updatedProfileData = { ...formData };
      let imageUploadSuccess = true;

      // If there's a new image selected, upload it first
      if (selectedImage) {
        console.log("Uploading new profile picture...");
        const imageFormData = new FormData();
        imageFormData.append('profile_picture', selectedImage);

        try {
          const imageResponse = await axios.put(
            "https://attendipen-d65abecaffe3.herokuapp.com/profile/edit",
            imageFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );

          console.log("Profile picture uploaded:", imageResponse.data);
          updatedProfileData.profile_picture = imageResponse.data.profile_picture;
        } catch (error) {
          console.error("Error uploading image:", error);
          imageUploadSuccess = false;
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Failed to upload profile picture",
            icon: "error",
            confirmButtonColor: "#4D44B5"
          });
          return; // Stop the process if image upload fails
        }
      }

      // Only proceed with profile update if image upload was successful or no new image was selected
      if (imageUploadSuccess) {
        console.log("Updating profile details...");
        const response = await axios.put(
          "https://attendipen-d65abecaffe3.herokuapp.com/profile/edit",
          updatedProfileData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Profile updated successfully:", response.data);
        
        const existingUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        const updatedUserData = {
          ...existingUserData,
          ...updatedProfileData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        console.log("Profile data saved to local storage:", updatedUserData);

        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully",
          icon: "success",
          confirmButtonColor: "#4D44B5"
        }).then(() => {
          navigate("/teachersDashboard");
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update profile",
        icon: "error",
        confirmButtonColor: "#4D44B5"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#152259] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#152259] px-6 py-6">
            <div className="flex items-center justify-center w-full h-12">
              <h2 className="text-2xl font-bold text-white text-center">Edit Profile</h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Picture Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Profile Picture</h3>
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    {(profilePicture && !preview) && (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-3 border-[#4D44B5] shadow-lg">
                        <img 
                          src={profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Error loading profile image');
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    )}
                    {preview && (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-3 border-[#4D44B5] shadow-lg">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-[#4D44B5] p-1.5 rounded-full cursor-pointer hover:bg-[#3D35A5] transition duration-200 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">Click the camera icon to change your profile picture</p>
                </div>
              </div>
              {/* Profile Information */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2  border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4D44B5] focus:border-transparent transition duration-200 mt-1"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2  border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4D44B5] focus:border-transparent transition duration-200 mt-1"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full p-2  border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4D44B5] focus:border-transparent transition duration-200 mt-1"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full   border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4D44B5] focus:border-transparent transition duration-200 "
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="w-full p-2  border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4D44B5] focus:border-transparent transition duration-200 mt-1"
                    placeholder="Tell us about yourself"
                    rows="4"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/MyProfile")}
                  className="px-6 py-2 border border-red-500 rounded-lg text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#152259] hover:bg-[#0f1a4a] focus:ring-[#152259]'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
