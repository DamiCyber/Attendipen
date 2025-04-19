import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const UploadStudentpic = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Error!',
          text: 'Please select an image file',
          icon: 'error',
          confirmButtonColor: '#1a237e'
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'Error!',
          text: 'Image size should be less than 5MB',
          icon: 'error',
          confirmButtonColor: '#1a237e'
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select an image first',
        icon: 'error',
        confirmButtonColor: '#1a237e'
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('profile_picture', selectedImage);

    try {
      const response = await axios.put(
        `https://attendipen-d65abecaffe3.herokuapp.com/students/${studentId}/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: 'Profile picture updated successfully',
          icon: 'success',
          confirmButtonColor: '#1a237e'
        }).then(() => {
          navigate(`/students`);
        });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to upload profile picture',
        icon: 'error',
        confirmButtonColor: '#1a237e'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#1a237e] px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Upload Student Profile Picture</h2>
              <button
                onClick={() => navigate(`/student/profile/${studentId}`)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Image Preview */}
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image selected</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex flex-col items-center space-y-4">
                <label className="cursor-pointer">
                  <span className="px-6 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#151d6b] transition-colors">
                    Select Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleUpload}
                  disabled={!selectedImage || loading}
                  className={`px-6 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a237e] transition-colors ${
                    !selectedImage || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#1a237e] hover:bg-[#151d6b]'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </div>
                  ) : (
                    'Upload Picture'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStudentpic;
