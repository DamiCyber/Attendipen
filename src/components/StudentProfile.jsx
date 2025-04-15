import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { studentId } = useParams();

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'Please login to continue', 'error');
        return;
      }

      const response = await axios.get(
        `https://attendipen-d65abecaffe3.herokuapp.com/profile/id_card/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data && response.data.data) {
        setStudent(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      Swal.fire('Error', 'Failed to fetch student data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Swal.fire('Error', 'Image size should be less than 5MB', 'error');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent(prev => ({ ...prev, profile_picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      Swal.fire('Error', 'Please select an image to upload', 'error');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profile_picture', selectedImage);

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
        fetchStudentData();
      } else {
        throw new Error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire('Error', 'Failed to update profile picture', 'error');
    } finally {
      setUploading(false);
      setSelectedImage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D44B5]"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">No student data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={student.profile_picture || 'https://via.placeholder.com/150'}
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profile-picture"
            />
            <label
              htmlFor="profile-picture"
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>

          {/* Student Information */}
          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Student ID</p>
                <p className="font-medium">{student.student_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Class</p>
                <p className="font-medium">{student.class_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Section</p>
                <p className="font-medium">{student.section}</p>
              </div>
              <div>
                <p className="text-gray-600">Roll Number</p>
                <p className="font-medium">{student.roll_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Group</p>
                <p className="font-medium">{student.blood_group}</p>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          {selectedImage && (
            <button
              onClick={handleImageUpload}
              disabled={uploading}
              className={`bg-[#4D44B5] text-white px-4 py-2 rounded-lg transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3a3385]'
              }`}
            >
              {uploading ? 'Uploading...' : 'Update Profile Picture'}
            </button>
          )}
        </div>
      
      </div>
       <Link to={`/students/profile/${studentId}`}>View Profile</Link>
    </div>
  );
};

export default StudentProfile;
