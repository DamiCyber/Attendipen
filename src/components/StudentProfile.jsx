import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { studentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      console.log('Fetching data for student ID:', studentId);
      fetchStudentData();
    } else {
      console.error('No student ID provided');
      Swal.fire('Error', 'No student ID provided', 'error');
  
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'Please login to continue', 'error');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `https://attendipen-d65abecaffe3.herokuapp.com/profile/id_card/${studentId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log('Student data response:', response.data);
      
      if (response.data) {
        // The API returns the HTML template directly
        setHtmlContent(response.data);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      Swal.fire('Error', 'Failed to fetch student data', 'error');
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D44B5]"></div>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">No student data available</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

export default StudentProfile;