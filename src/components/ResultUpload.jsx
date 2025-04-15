import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResultUpload = () => {
  const [formData, setFormData] = useState({
    subject_class_id: '',
    student_id: '',
    score: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Please login to continue', 'error');
      return;
    }

    try {
      const response = await axios.post(
        'https://attendipen-d65abecaffe3.herokuapp.com/subjects/upload_result',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Result uploaded successfully', 'success');
        setFormData({
          subject_class_id: '',
          student_id: '',
          score: ''
        });
      }
    } catch (error) {
      console.error('Error uploading result:', error);
      Swal.fire('Error', 'Failed to upload result', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Student Result</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Class ID</label>
            <input
              type="number"
              name="subject_class_id"
              value={formData.subject_class_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="number"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Score</label>
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white font-semibold ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              {loading ? 'Uploading...' : 'Upload Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultUpload;
