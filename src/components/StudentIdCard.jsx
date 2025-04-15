import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StudentIdCard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentIdCard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        if (!id) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Student ID is required',
          });
          setLoading(false);
          return;
        }

        const response = await axios({
          method: 'get',
          url: `https://attendipen-d65abecaffe3.herokuapp.com/profile/id_card/${id}`,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data && response.data.data) {
          setStudentData(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student ID card:', error);
        let errorMessage = 'Failed to fetch student ID card information';
        
        if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Session expired. Please login again.';
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            errorMessage = error.response.data?.message || errorMessage;
          }
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
        setLoading(false);
      }
    };

    fetchStudentIdCard();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D44B5]"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">No student data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#4D44B5]">Student ID Card</h1>
        <button
          onClick={handlePrint}
          className="bg-[#4D44B5] text-white px-4 py-2 rounded-lg hover:bg-[#3a3385] transition-colors"
        >
          Print ID Card
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                src={studentData.profile_picture || 'https://via.placeholder.com/150'}
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{studentData.name}</h2>
              <p className="text-gray-600">Student ID: {studentData.student_id}</p>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Class:</p>
                <p className="font-medium">{studentData.class_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Section:</p>
                <p className="font-medium">{studentData.section}</p>
              </div>
              <div>
                <p className="text-gray-600">Roll Number:</p>
                <p className="font-medium">{studentData.roll_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Date of Birth:</p>
                <p className="font-medium">{studentData.date_of_birth}</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Group:</p>
                <p className="font-medium">{studentData.blood_group}</p>
              </div>
              <div>
                <p className="text-gray-600">Emergency Contact:</p>
                <p className="font-medium">{studentData.emergency_contact}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-600">Address:</p>
              <p className="font-medium">{studentData.address}</p>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600">Valid Until:</p>
                <p className="font-medium">{studentData.valid_until}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Issued Date:</p>
                <p className="font-medium">{studentData.issued_date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none;
          }
          body {
            background: white;
          }
          .container {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentIdCard;
