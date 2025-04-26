import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import "../assets/style/dashboard.css";

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const ParentView = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const { studentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      fetchAttendance();
    }
  }, [studentId]);

  const fetchAttendance = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Authentication Error',
        text: 'Please login to continue',
        icon: 'error',
        confirmButtonColor: "#1a237e"
      });
      navigate('/login');
      return;
    }

    try {
      // First, verify the user is a parent
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.type !== 'parent') {
        throw new Error('Only parents can view student attendance');
      }

      // Debug logs
      console.log('User:', user);
      console.log('Token:', token);
      console.log('Student ID:', studentId);
      console.log('Request URL:', `${BASE_URL}/attendance/view/${studentId}/1`);

      const response = await axios.get(
        `${BASE_URL}/attendance/view/${studentId}/1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setAttendance(response.data.attendance || []);
        if (response.data.attendance && response.data.attendance.length > 0) {
          setStudentName(response.data.attendance[0].student_name);
        }
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      let errorMessage = 'Failed to fetch attendance records';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: "#1a237e"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading attendance records...</p>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>{studentName ? `${studentName}'s Attendance Records` : 'Attendance Records'}</h2>
        <button onClick={() => navigate('/parents/children')}>Back to Children</button>
      </div>

      {attendance.length === 0 ? (
        <div className="no-records">
          <p>No attendance records found</p>
        </div>
      ) : (
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.class_name}</td>
                  <td>
                    <span className={`status-badge ${record.status}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{new Date(record.date).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParentView;
