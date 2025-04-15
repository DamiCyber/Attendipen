import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const StudentId = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { studentId } = useParams();

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Please login to continue', 'error');
      return;
    }

    try {
      const response = await axios.get(
        `https://attendipen-d65abecaffe3.herokuapp.com/profile/id_card/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setStudentData(response.data.student);
        if (response.data.student.profile_picture) {
          setImagePreview(response.data.student.profile_picture);
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      Swal.fire('Error', 'Failed to fetch student data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    
    if (!file) {
      Swal.fire('Error', 'Please select an image to upload', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Please login to continue', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    setUploading(true);
    try {
      const response = await axios.put(
        `https://attendipen-d65abecaffe3.herokuapp.com/students/${studentId}/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Profile picture updated successfully', 'success');
        fetchStudentData(); // Refresh student data
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire('Error', 'Failed to update profile picture', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Student ID Card</h2>
          
          {studentData ? (
            <div className="flex flex-col items-center space-y-6">
              {/* Profile Picture Section */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('profile-picture').click()}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Student Information */}
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">{studentData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <p className="mt-1 text-gray-900">{studentData.student_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Class</label>
                    <p className="mt-1 text-gray-900">{studentData.class_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">School</label>
                    <p className="mt-1 text-gray-900">{studentData.school_name}</p>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleImageUpload}
                disabled={uploading || !imagePreview}
                className={`px-4 py-2 rounded-md text-white font-semibold ${
                  uploading || !imagePreview
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors duration-200`}
              >
                {uploading ? 'Uploading...' : 'Update Profile Picture'}
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No student data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentId;
