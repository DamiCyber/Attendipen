import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../assets/style/dashboard.css";

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const ParentChild = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch all students with type=object
        const response = await axios.get(
          `${BASE_URL}/students/all?type=object`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setStudents(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [navigate]);

  const handleViewAttendance = (e, studentId) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/parents/view/${studentId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="parent-students">
      <h2>My Children</h2>
      {students.length === 0 ? (
        <div className="no-students">
          <p>No students found. Please accept admission invites to view your children.</p>
          <button onClick={() => navigate('/students/admission')}>View Admission Invites</button>
        </div>
      ) : (
        <div className="students-list">
          {students.map((student) => (
            <div 
              key={student.id} 
              className="student-name-card"
              onClick={() => navigate(`/parents/students/${student.id}`)}
            >
              <div className="student-initial">
                {student.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="student-info">
                <h3>{student.name}</h3>
                <button 
                  className="attendance-btn"
                  onClick={(e) => handleViewAttendance(e, student.id)}
                >
                  View Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentChild;
