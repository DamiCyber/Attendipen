import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../assets/style/addteacher.css";

const Student = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentPictures, setStudentPictures] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        // Fetch student count
        const countResponse = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/students/all?type=count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Fetch student objects
        const studentsResponse = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/students/all?type=object",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStudents(studentsResponse.data);
        setLoading(false);

        // Fetch profile pictures for each student
        const pictures = {};
        for (const student of studentsResponse.data) {
          try {
            const pictureResponse = await axios.get(
              `https://attendipen-d65abecaffe3.herokuapp.com/students/all?type=profile_picture&student_id=${student.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
              }
            );
            pictures[student.id] = URL.createObjectURL(pictureResponse.data);
          } catch (pictureError) {
            console.log(`No profile picture found for student ${student.id}`);
          }
        }
        setStudentPictures(pictures);
      } catch (error) {
        console.error("Error fetching students:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch student data",
          icon: "error",
        });
        setLoading(false);
      }
    };

    fetchStudents();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading">Loading students...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebarUp">
        <nav>
          <ul>
            <div>
              <div className="side-logo">
                <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1734938938/amend_lntakp.png" alt="" />
                <h1>Attendipen</h1>
              </div>
              <div className="border-line"></div>
            </div>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="students-container">
          <div className="students-header">
            <h2>Students</h2>
            <button 
              onClick={() => navigate("/AddStudent")} 
              className="add-student-btn"
            >
              Add Student
            </button>
          </div>

          {students.length > 0 ? (
            <div className="students-grid">
              {students.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-picture">
                    {studentPictures[student.id] ? (
                      <img 
                        src={studentPictures[student.id]} 
                        alt={`${student.name}'s profile`} 
                        className="student-profile-picture"
                      />
                    ) : (
                      <div className="student-picture-placeholder">
                        <span>{student.name ? student.name.charAt(0).toUpperCase() : '?'}</span>
                      </div>
                    )}
                  </div>
                  <div className="student-info">
                    <h3>{student.name || "Unnamed Student"}</h3>
                    <p>ID: {student.id}</p>
                    <p>Email: {student.email || "Not set"}</p>
                    <p>Gender: {student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : "Not set"}</p>
                    <p>Phone: {student.phone_number || "Not set"}</p>
                    <p>Address: {student.address || "Not set"}</p>
                  </div>
                  <div className="student-actions">
                    <button 
                      onClick={() => navigate(`/ViewProfile/${student.id}`)}
                      className="view-profile-btn"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => navigate(`/Mark/${student.id}`)}
                      className="mark-attendance-btn"
                    >
                      Mark Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-students">
              <p>No students found. Add your first student to get started.</p>
              <button 
                onClick={() => navigate("/AddStudent")} 
                className="add-student-btn"
              >
                Add Student
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;
